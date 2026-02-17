const mongoose = require("mongoose")
const { MongoMemoryReplSet } = require("mongodb-memory-server")
const request = require("supertest")
const jwt = require("jsonwebtoken")

let replSet
let app

// ── Models ──
const userModel = require("../src/models/user.model")
const accountModel = require("../src/models/account.model")
const transactionModel = require("../src/models/transaction.model")

// ── Helpers ──
function makeToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "test-secret")
}

beforeAll(async () => {
    // Use an in-memory replica set (required for transactions)
    replSet = await MongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: "wiredTiger" },
    })
    const uri = replSet.getUri()

    process.env.JWT_SECRET = "test-secret"
    process.env.MONGO_URI = uri

    await mongoose.connect(uri)

    // Re-require app AFTER env vars are set
    app = require("../src/app")
})

afterAll(async () => {
    await mongoose.disconnect()
    if (replSet) await replSet.stop()
})

afterEach(async () => {
    // Clean up collections between tests
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
})

// ── Seed helpers ──
async function createUser(overrides = {}) {
    return userModel.create({
        email: `user${Date.now()}@test.com`,
        password: "password123",
        name: "Test User",
        ...overrides,
    })
}

async function createAccount(userId) {
    return accountModel.create({ user: userId })
}

async function seedFunds(fromSystemAccount, toAccountId, amount) {
    // Directly insert a CREDIT ledger entry (bootstrapping)
    const ledgerModel = require("../src/models/ledger.model")
    const txn = await transactionModel.create({
        fromAccount: fromSystemAccount,
        toAccount: toAccountId,
        amount,
        idempotencyKey: `seed-${Date.now()}-${Math.random()}`,
        status: "COMPLETED",
    })
    await ledgerModel.create({
        account: toAccountId,
        amount,
        transaction: txn._id,
        type: "CREDIT",
    })

    // UPDATE BALANCE for the new atomic guard 
    await accountModel.updateOne(
        { _id: toAccountId },
        { $inc: { balance: amount } }
    )
}

// ──────────────────────────────────────────
// Tests
// ──────────────────────────────────────────

describe("Transaction System", () => {

    // ── 1. Input validation ──
    describe("Input Validation", () => {
        it("rejects missing fields", async () => {
            const user = await createUser()
            const token = makeToken(user._id)

            const res = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${token}`)
                .send({})

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Validation failed")
            expect(res.body.errors.length).toBeGreaterThan(0)
        })

        it("rejects negative amount", async () => {
            const user = await createUser()
            const token = makeToken(user._id)

            const res = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    fromAccount: new mongoose.Types.ObjectId().toHexString(),
                    toAccount: new mongoose.Types.ObjectId().toHexString(),
                    amount: -100,
                    idempotencyKey: "key-neg",
                })

            expect(res.status).toBe(400)
            expect(res.body.errors.some((e) => e.field === "amount")).toBe(true)
        })

        it("rejects same fromAccount and toAccount", async () => {
            const user = await createUser()
            const token = makeToken(user._id)
            const id = new mongoose.Types.ObjectId().toHexString()

            const res = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    fromAccount: id,
                    toAccount: id,
                    amount: 100,
                    idempotencyKey: "key-same",
                })

            expect(res.status).toBe(400)
        })
    })

    // ── 2. Ownership enforcement ──
    describe("Ownership Enforcement", () => {
        it("blocks transfer from another user's account", async () => {
            const userA = await createUser({ email: "a@test.com" })
            const userB = await createUser({ email: "b@test.com" })
            const accountA = await createAccount(userA._id)
            const accountB = await createAccount(userB._id)

            // User B tries to transfer FROM user A's account
            const tokenB = makeToken(userB._id)

            const res = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${tokenB}`)
                .send({
                    fromAccount: accountA._id.toHexString(),
                    toAccount: accountB._id.toHexString(),
                    amount: 100,
                    idempotencyKey: "ownership-test",
                })

            expect(res.status).toBe(403)
            expect(res.body.message).toMatch(/insufficient permissions/)
        })
    })

    // ── 3. Insufficient balance ──
    describe("Insufficient Balance", () => {
        it("returns 400 when balance is too low", async () => {
            const user = await createUser()
            const fromAcc = await createAccount(user._id)
            const toAcc = await createAccount(user._id)

            // No funds seeded — balance is 0
            const token = makeToken(user._id)

            const res = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    fromAccount: fromAcc._id.toHexString(),
                    toAccount: toAcc._id.toHexString(),
                    amount: 1000,
                    idempotencyKey: "insuff-test",
                })

            expect(res.status).toBe(400)
            expect(res.body.message).toMatch(/Insufficient funds/)
        })
    })

    // ── 4. Successful transfer ──
    describe("Successful Transfer", () => {
        it("completes a valid transaction", async () => {
            const user = await createUser()
            const fromAcc = await createAccount(user._id)
            const toAcc = await createAccount(user._id)

            // Seed 500 into fromAcc
            await seedFunds(toAcc._id, fromAcc._id, 500)

            const token = makeToken(user._id)

            const res = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    fromAccount: fromAcc._id.toHexString(),
                    toAccount: toAcc._id.toHexString(),
                    amount: 200,
                    idempotencyKey: "success-test",
                })

            expect(res.status).toBe(201)
            expect(res.body.transaction.status).toBe("COMPLETED")

            // Verify balances
            const fromBalance = await (await accountModel.findById(fromAcc._id)).getBalance()
            const toBalance = await (await accountModel.findById(toAcc._id)).getBalance()

            expect(fromBalance).toBe(300) // 500 - 200
            expect(toBalance).toBe(200) // 0 + 200
        })
    })

    // ── 5. Idempotency ──
    describe("Idempotency", () => {
        it("returns 200 with original transaction on duplicate key", async () => {
            const user = await createUser()
            const fromAcc = await createAccount(user._id)
            const toAcc = await createAccount(user._id)

            await seedFunds(toAcc._id, fromAcc._id, 1000)

            const token = makeToken(user._id)
            const payload = {
                fromAccount: fromAcc._id.toHexString(),
                toAccount: toAcc._id.toHexString(),
                amount: 100,
                idempotencyKey: "idempotent-key-1",
            }

            // First request — should succeed
            const res1 = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${token}`)
                .send(payload)

            expect(res1.status).toBe(201)

            // Second request — same key — should return 200
            const res2 = await request(app)
                .post("/api/transactions")
                .set("Authorization", `Bearer ${token}`)
                .send(payload)

            expect(res2.status).toBe(200)
            expect(res2.body.message).toMatch(/already processed/)

            // Verify only one debit happened (balance should be 900, not 800)
            const balance = await (await accountModel.findById(fromAcc._id)).getBalance()
            expect(balance).toBe(900)
        })
    })

    // ── 6. Double-spend simulation ──
    // NOTE: This test requires a REAL MongoDB replica set with proper write
    // conflict detection. In mongodb-memory-server, aggregation-based balance
    // reads are not serialized within transactions, so both requests may
    // succeed. On a production MongoDB instance, the second request will
    // receive a WriteConflict error and be aborted by the session.
    //
    // To run this test against a real replica set:
    //   1. Set MONGO_URI to your replica set URI
    //   2. Remove the `.skip`
    describe("Double-Spend Prevention (requires real replica set)", () => {
        // NOTE: We are removing .skip. If using MongoMemoryReplSet (which we are), 
        // it supports transactions. With our new `findOneAndUpdate` atomic lock on `balance`,
        // this test SHOULD pass even in memory server.
        it("only allows one of two concurrent transfers to succeed when balance is limited", async () => {
            const user = await createUser()
            const fromAcc = await createAccount(user._id)
            const toAcc = await createAccount(user._id)

            // Seed exactly 100
            await seedFunds(toAcc._id, fromAcc._id, 100)

            // Verify initial state
            const initialBalance = await (await accountModel.findById(fromAcc._id)).balance
            expect(initialBalance).toBe(100)

            const token = makeToken(user._id)

            // Fire two concurrent requests, each trying to transfer 100
            const [res1, res2] = await Promise.all([
                request(app)
                    .post("/api/transactions")
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                        fromAccount: fromAcc._id.toHexString(),
                        toAccount: toAcc._id.toHexString(),
                        amount: 100,
                        idempotencyKey: "double-spend-1",
                    }),
                request(app)
                    .post("/api/transactions")
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                        fromAccount: fromAcc._id.toHexString(),
                        toAccount: toAcc._id.toHexString(),
                        amount: 100,
                        idempotencyKey: "double-spend-2",
                    }),
            ])

            const statuses = [res1.status, res2.status].sort()

            // We expect at least one failure
            // One should succeed (201), One should fail (400 Insufficient Funds)
            expect(statuses).toEqual(expect.arrayContaining([201, 400]))

            // The CRITICAL invariant: final balance must NEVER go negative
            const finalFromAccount = await accountModel.findById(fromAcc._id)
            expect(finalFromAccount.balance).toBeGreaterThanOrEqual(0)
            expect(finalFromAccount.balance).toBe(0) // 100 - 100 = 0

            // Assert exactly one transaction completed
            const completedTxns = await transactionModel.find({
                fromAccount: fromAcc._id,
                status: "COMPLETED",
                idempotencyKey: { $regex: /^double-spend/ }
            })
            expect(completedTxns.length).toBe(1)

            // Assert exactly one debit ledger entry for the completed transaction
            const debitCount = await require("../src/models/ledger.model").countDocuments({
                transaction: completedTxns[0]._id,
                type: "DEBIT"
            })
            expect(debitCount).toBe(1)
        })
    })
})
