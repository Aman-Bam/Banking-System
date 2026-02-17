const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    // ── ADDED: Mutable balance field ──
    // This is the CONCURRENCY GATE. 
    // It must only be modified by the transaction engine.
    balance: {
        type: Number,
        default: 0,
        min: [0, "Account balance cannot be negative"]
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 })

/**
 * Get account balance.
 * 
 * NOTE: With the reintroduction of the `balance` field, this method now 
 * primarily returns the stored balance. 
 *
 * @param {ClientSession} [session] - MongoDB session
 * @returns {Promise<number>}
 */
accountSchema.methods.getBalance = async function (session) {
    return this.balance
}

/*
// DEPRECATED: Old aggregation-based balance check.
// kept for reference or optional audit/reconciliation.
accountSchema.methods.getLedgerBalance = async function (session) {
    const ledgerModel = require("./ledger.model")
    const pipeline = [
        { $match: { account: this._id } },
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

    const options = session ? { session } : {}
    const balanceData = await ledgerModel.aggregate(pipeline, options)

    if (balanceData.length === 0) {
        return 0
    }

    return balanceData[0].balance
}
*/


const accountModel = mongoose.model("account", accountSchema)



module.exports = accountModel