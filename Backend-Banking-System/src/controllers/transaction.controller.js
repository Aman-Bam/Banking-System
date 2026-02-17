const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")
const logger = require("../config/logger")

/**
 * Create a new transaction (transfer between accounts)
 *
 * FLOW (all inside one MongoDB session):
 *  1. Idempotency check
 *  2. Ownership enforcement (fromAccount must belong to req.user)
 *  3. Account status validation
 *  4. Balance check (inside session — prevents race conditions)
 *  5. Create transaction (PENDING)
 *  6. Create DEBIT ledger entry
 *  7. Create CREDIT ledger entry
 *  8. Mark transaction COMPLETED
 *  9. Commit session
 * 10. Send email (fire-and-forget, outside session)
 */
/**
 * Execute a transfer with retry logic for transient errors
 */
async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    const MAX_RETRIES = 3
    let attempt = 0

    while (attempt < MAX_RETRIES) {
        attempt++
        try {
            return await executeTransaction(req, res, { fromAccount, toAccount, amount, idempotencyKey })
        } catch (error) {
            const isTransient = error.hasErrorLabel && (
                error.hasErrorLabel('TransientTransactionError') ||
                error.hasErrorLabel('UnknownTransactionCommitResult')
            )
            const isWriteConflict = error.code === 112 || error.message.includes('WriteConflict')

            if ((isTransient || isWriteConflict) && attempt < MAX_RETRIES) {
                logger.warn(`Transaction retry attempt ${attempt} due to transient error`, {
                    error: error.message,
                    idempotencyKey
                })
                // Simple backoff
                await new Promise(resolve => setTimeout(resolve, attempt * 50))
                continue
            }

            // If not transient or max retries reached, fail
            logger.error("Transaction failed permanently", {
                attempt,
                error: error.message,
                idempotencyKey
            })

            return res.status(500).json({
                message: "Transaction failed. Please try again.",
                error: error.message
            })
        }
    }
}

/**
 * Core transaction logic
 */
async function executeTransaction(req, res, { fromAccount, toAccount, amount, idempotencyKey }) {
    // ── 1. Idempotency check (Optimistic - before session) ──
    const existing = await transactionModel.findOne({ idempotencyKey })

    if (existing) {
        if (existing.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: existing,
            })
        }
        if (existing.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
                transaction: existing,
            })
        }
        // FAILED or REVERSED
        return res.status(409).json({
            message: `Transaction previously ${existing.status.toLowerCase()}. Use a new idempotencyKey to retry.`,
            transaction: existing,
        })
    }

    // ── Start session with STRICT isolation ──
    const session = await mongoose.startSession()
    session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' }
    })

    let transaction = null

    try {
        // ── 2. Ownership & Validity (Reads) ──
        // We verify accounts exist and ownership *inside* the transaction 
        // to ensure they don't change status mid-flight.
        const fromUserAccount = await accountModel.findOne(
            { _id: fromAccount, user: req.user._id, status: "ACTIVE" },
            null,
            { session }
        )

        if (!fromUserAccount) {
            await session.abortTransaction()
            session.endSession()
            return res.status(403).json({ message: "Invalid fromAccount or insufficient permissions" })
        }

        const toUserAccount = await accountModel.findOne(
            { _id: toAccount, status: "ACTIVE" },
            null,
            { session }
        )

        if (!toUserAccount) {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({ message: "Invalid toAccount" })
        }

        // ── 3. ATOMIC DEBIT (The Concurrency Gate) ──
        // This is the critical write contention point.
        // We attempt to decrement ONLY if balance >= amount.
        const updatedFromAccount = await accountModel.findOneAndUpdate(
            { _id: fromAccount, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { session, new: true }
        )

        if (!updatedFromAccount) {
            // If null, it means condition (balance >= amount) failed
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({
                message: "Insufficient funds",
                currentBalance: fromUserAccount.balance
            })
        }

        // ── 4. ATOMIC CREDIT ──
        const updatedToAccount = await accountModel.findOneAndUpdate(
            { _id: toAccount },
            { $inc: { balance: amount } },
            { session, new: true }
        )

        // ── 5. Create Transaction Record (PENDING) ──
        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0]

        // ── 6. Create Ledger Entries (Immutable Audit) ──
        await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        // ── 7. Mark COMPLETED ──
        transaction = await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session, new: true }
        )

        // ── 8. Commit ──
        await session.commitTransaction()
        session.endSession()

        // ── 9. Post-Commit Actions (Email) ──
        emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
            .catch(err => logger.error("Failed to send email", { error: err.message }))

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction
        })

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction()
        }
        session.endSession()

        // Re-throw to be caught by the retry loop
        throw error
    }
}

/**
 * Create initial funds transaction (system user only)
 */
/**
 * Create initial funds transaction (system user only)
 */
async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    // ── Idempotency check ──
    const existing = await transactionModel.findOne({ idempotencyKey })
    if (existing) {
        return res.status(200).json({
            message: "Transaction already processed",
            transaction: existing,
        })
    }

    // ── Ownership: system user's own account ──
    // This is run OUTSIDE the transaction for the initial check,
    // but we'll re-verify or lock inside if needed, though for system funds
    // we usually assume the system account exists.
    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found",
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' }
    })

    let transaction = null

    try {
        // ── Verify toAccount existence ──
        const toUserAccount = await accountModel.findOne(
            { _id: toAccount },
            null,
            { session }
        )

        if (!toUserAccount) {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({
                message: "Invalid toAccount",
            })
        }

        // ── ATOMIC CREDIT (toAccount) ──
        await accountModel.findOneAndUpdate(
            { _id: toAccount },
            { $inc: { balance: amount } },
            { session, new: true }
        )

        // ── ATOMIC DEBIT (System Account - Allow Negative for Minting) ──
        // For initial funds, we might allow the system account to go negative
        // or we simply decrement it. 
        await accountModel.findOneAndUpdate(
            { _id: fromUserAccount._id },
            { $inc: { balance: -amount } },
            { session, new: true }
        )

        // ── Create transaction (PENDING) ──
        transaction = (
            await transactionModel.create(
                [
                    {
                        fromAccount: fromUserAccount._id,
                        toAccount,
                        amount,
                        idempotencyKey,
                        status: "PENDING",
                    },
                ],
                { session }
            )
        )[0]

        // ── DEBIT from system account ──
        await ledgerModel.create(
            [
                {
                    account: fromUserAccount._id,
                    amount: amount,
                    transaction: transaction._id,
                    type: "DEBIT",
                },
            ],
            { session }
        )

        // ── CREDIT to target account ──
        await ledgerModel.create(
            [
                {
                    account: toAccount,
                    amount: amount,
                    transaction: transaction._id,
                    type: "CREDIT",
                },
            ],
            { session }
        )

        // ── Mark COMPLETED ──
        transaction = await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session, new: true }
        )

        await session.commitTransaction()
        session.endSession()

        logger.info("Initial funds transaction completed", {
            transactionId: transaction._id,
            toAccount,
            amount,
        })
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction()
        }
        session.endSession()

        logger.error("Initial funds transaction failed", {
            error: error.message,
            idempotencyKey,
        })

        if (transaction) {
            try {
                await transactionModel.findOneAndUpdate(
                    { _id: transaction._id },
                    { status: "FAILED" }
                )
            } catch (updateErr) {
                logger.error("Failed to mark initial-funds transaction as FAILED", {
                    transactionId: transaction._id,
                    error: updateErr.message,
                })
            }
        }

        return res.status(500).json({
            message: "Initial funds transaction failed. Please retry.",
        })
    }

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction,
    })
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction,
}
