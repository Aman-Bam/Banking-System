const { Router } = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const reconciliationController = require("../controllers/reconciliation.controller")

const adminRoutes = Router()

/**
 * GET /api/admin/reconcile/:accountId
 * System-user only — reconcile account balance from ledger
 */
adminRoutes.get(
    "/reconcile/:accountId",
    authMiddleware.authSystemUserMiddleware,
    reconciliationController.reconcileAccount
)

module.exports = adminRoutes
