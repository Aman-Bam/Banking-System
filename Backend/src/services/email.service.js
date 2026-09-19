const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error("Error connecting to email server", { error: error.message });
  } else {
    logger.info("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    logger.info("Email sent", { messageId: info.messageId, to });
  } catch (error) {
    logger.error("Error sending email", { error: error.message, to });
  }
};

async function sendRegistrationEmail(userEmail, name) {
    
  const subject = `Welcome to Backend Ledger, ${name}!`;

  const text = `Hi ${name},

Welcome to Backend Ledger! We're excited to have you on board.

Your account is all set up and ready to go. If you have any questions, feel free to reply directly to this email.

Best,
The Backend Ledger Team`;

  const html = `
<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #0f172a; margin-top: 0;">Welcome to Backend Ledger!</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">
    Hi ${name},<br><br>
    Thanks for signing up. We're excited to have you on board! Your account is all set up and ready to go.
  </p>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">
    If you ever have any questions, feel free to reply directly to this email.
  </p>
  <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
    Best,<br>
    <strong>The Backend Ledger Team</strong>
  </p>
</div>
`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful!";
  const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed";
  const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
