const express = require("express")
const authController = require("../controllers/auth.controller")
const { googleLoginController } = require("../controllers/googleAuth.controller")

const { validate, registerSchema, loginSchema } = require("../middleware/validators")

const router = express.Router()


/* POST /api/auth/register */
router.post("/register", validate(registerSchema), authController.userRegisterController)


/* POST /api/auth/login */
router.post("/login", validate(loginSchema), authController.userLoginController)

/* POST /api/auth/google */
router.post("/google", googleLoginController)

/**
 * - POST /api/auth/logout
 */
router.post("/logout", authController.userLogoutController)

module.exports = router