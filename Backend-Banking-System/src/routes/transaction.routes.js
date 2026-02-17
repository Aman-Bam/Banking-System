const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require("../controllers/transaction.controller")
const { validate, createTransactionSchema, createInitialFundsSchema } = require("../middleware/validators")

const transactionRoutes = Router();

/**
 * POST /api/transactions/
 * Create a new transaction (transfer between accounts)
 */
transactionRoutes.post(
    "/",
    authMiddleware.authMiddleware,
    validate(createTransactionSchema),
    transactionController.createTransaction
)

/**
 * POST /api/transactions/system/initial-funds
 * Create initial funds transaction from system user
 */
transactionRoutes.post(
    "/system/initial-funds",
    authMiddleware.authSystemUserMiddleware,
    validate(createInitialFundsSchema),
    transactionController.createInitialFundsTransaction
)

module.exports = transactionRoutes;