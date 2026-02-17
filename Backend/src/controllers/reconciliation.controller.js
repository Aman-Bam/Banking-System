const accountModel = require("../models/account.model")
const logger = require("../config/logger")

/**
 * GET /api/admin/reconcile/:accountId
 *
 * Recalculates the account balance from ledger entries and compares
 * it to the stored/computed balance. This is how real systems detect
 * data corruption or inconsistencies.
 */
async function reconcileAccount(req, res) {
    const { accountId } = req.params

    const account = await accountModel.findById(accountId)

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
        })
    }

    // Aggregation-based balance (Source of Truth for Audit)
    // We can use the deprecated method or re-implement the pipeline here.
    // Let's use the pipeline directly to be explicit about what we are checking.
    const ledgerModel = require("../models/ledger.model")
    const pipeline = [
        { $match: { account: account._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }
            }
        }
    ]

    const balanceData = await ledgerModel.aggregate(pipeline)
    const ledgerBalance = balanceData.length > 0 ? balanceData[0].balance : 0

    const storedBalance = account.balance
    const isSynchronized = Math.abs(ledgerBalance - storedBalance) < 0.0000001 // Float tolerance if needed, though we use integers usually

    if (!isSynchronized) {
        logger.error("CRITICAL: DRIFT DETECTED", {
            accountId,
            storedBalance,
            ledgerBalance,
            drift: storedBalance - ledgerBalance
        })
    } else {
        logger.info("Reconciliation success: Balances match", {
            accountId,
            balance: storedBalance
        })
    }

    return res.status(200).json({
        accountId: account._id,
        userId: account.user,
        currency: account.currency,
        status: account.status,
        balances: {
            stored: storedBalance,
            ledger: ledgerBalance,
        },
        isSynchronized,
        reconciledAt: new Date().toISOString(),
    })
}

module.exports = {
    reconcileAccount,
}
