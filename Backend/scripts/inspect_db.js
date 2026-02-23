console.log("Starting inspect script...");
console.log("CWD:", process.cwd());
console.log("__dirname:", __dirname);

require("dotenv").config(); // Should pick up .env from CWD (Backend)

const mongoose = require("mongoose");
console.log("Mongoose loaded");

try {
    const User = require("../src/models/user.model");
    console.log("User model loaded");
    const Account = require("../src/models/account.model");
    console.log("Account model loaded");
    const Transaction = require("../src/models/transaction.model");
    console.log("Transaction model loaded");
    const Ledger = require("../src/models/ledger.model");
    console.log("Ledger model loaded");

    async function inspect() {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing in .env");
            process.exit(1);
        }
        console.log("Connecting to:", process.env.MONGO_URI);

        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to DB");

            const userCount = await User.countDocuments();
            console.log("Users:", userCount);

            const accountCount = await Account.countDocuments();
            console.log("Accounts:", accountCount);

            const txCount = await Transaction.countDocuments();
            console.log("Transactions:", txCount);

            const ledgerCount = await Ledger.countDocuments();
            console.log("Ledgers:", ledgerCount);

            console.log("\n--- Users (First 5) ---");
            const users = await User.find().limit(5);
            users.forEach(u => console.log(`${u._id}: ${u.email} (${u.role || 'user'})`));

            console.log("\n--- Accounts (First 5) ---");
            const accounts = await Account.find().limit(5).populate('user'); // removed 'email' selection to just populate whole user for safety
            accounts.forEach(a => console.log(`${a._id}: User=${a.user ? a.user.email : 'null'}, Balance=${a.balance}`));

            console.log("\n--- Transactions (First 5) ---");
            const txs = await Transaction.find().sort({ createdAt: 1 }).limit(5); // Show oldest first to find origin
            txs.forEach(t => console.log(`${t._id}: ${t.amount} from ${t.fromAccount} to ${t.toAccount}, status=${t.status}, key=${t.idempotencyKey}`));

            console.log("\n--- Ledgers (First 5) ---");
            const ledgers = await Ledger.find().limit(5);
            ledgers.forEach(l => console.log(`${l._id}: Account=${l.account}, Type=${l.type}, Amount=${l.amount}`));

        } catch (err) {
            console.error("Error during inspection:", err);
        } finally {
            await mongoose.disconnect();
            console.log("Disconnected");
        }
    }

    inspect();
} catch (err) {
    console.error("Error loading models:", err);
}
