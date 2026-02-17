const express = require("express")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")


const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

/**
 * Rate limiting on transaction routes
 * 30 requests per minute per IP
 */
const transactionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many transaction requests. Please try again later.",
    },
})

/**
 * Routes
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")
const adminRoutes = require("./routes/admin.routes")

/**
 * Health check
 */
app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionLimiter, transactionRoutes)
app.use("/api/admin", adminRoutes)

module.exports = app