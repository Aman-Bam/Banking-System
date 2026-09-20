const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

/**
 * - Google OAuth Login / Register Controller
 * - POST /api/auth/google
 */
async function googleLoginController(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Google ID Token is required",
        status: "failed",
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;

    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google payload" });
    }

    const { sub: googleId, email, name, picture } = payload;

    // 2. Check if user exists by googleId or email
    let user = await userModel.findOne({
      $or: [{ googleId }, { email }],
    });

    if (!user) {
      // 3. Register new Google user
      user = await userModel.create({
        email,
        name: name || email.split("@")[0],
        googleId,
        picture,
      });

      // Automatically create primary bank account for new user with $1,000 initial bonus
      await accountModel.create({
        user: user._id,
        balance: 1000,
      });
    } else if (!user.googleId) {
      // Link existing email account to Google ID
      user.googleId = googleId;
      if (picture) user.picture = picture;
      await user.save();
    }

    // 4. Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(401).json({
      message: "Google Authentication failed",
      error: err.message,
    });
  }
}

module.exports = {
  googleLoginController,
};
