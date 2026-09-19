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
const subject = `Transaction Successful: $${amount} sent`;

const text = `Hi ${name},

Your transaction of $${amount} to account ${toAccount} was completed successfully.

Transaction Details:
• Amount: $${amount}
• Recipient Account: ${toAccount}
• Status: Completed

If you did not authorize this payment, please reply to this email immediately.

Best,
The Backend Ledger Team`;

const html = `
<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="font-size: 13px; font-weight: 600; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
    ✓ Transfer Complete
  </div>
  <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 20px;">
    Transaction Successful
  </h2>
  
  <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
    Hi ${name}, your transfer has been processed and recorded.
  </p>

  <!-- Details Card -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
    <table width="100%" style="font-size: 14px; border-collapse: collapse;">
      <tr>
        <td style="color: #64748b; padding-bottom: 8px;">Amount</td>
        <td align="right" style="color: #0f172a; font-weight: 600; font-size: 16px; padding-bottom: 8px;">$${amount}</td>
      </tr>
      <tr>
        <td style="color: #64748b; padding-bottom: 8px;">Recipient Account</td>
        <td align="right" style="color: #0f172a; font-family: monospace; font-size: 13px; padding-bottom: 8px;">${toAccount}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Status</td>
        <td align="right" style="color: #16a34a; font-weight: 600;">Completed</td>
      </tr>
    </table>
  </div>

  <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0 0 20px 0;">
    Didn't make this payment? Please contact support or reply directly to this email immediately.
  </p>

  <p style="color: #64748b; font-size: 13px; margin: 0;">
    Best,<br>
    <strong>The Backend Ledger Team</strong>
  </p>
</div>
`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
const subject = `Action Required: Transaction of $${amount} Failed`;

const text = `Hi ${name},

Your attempt to transfer $${amount} to account ${toAccount} could not be completed.

Transaction Details:
• Amount: $${amount}
• Recipient Account: ${toAccount}
• Status: Failed

No funds were deducted from your account. Please verify the recipient account details or your balance before trying again.

If you need help, reply directly to this email.

Best,
The Backend Ledger Team`;

const html = `
<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #fee2e2; border-radius: 8px;">
  <div style="font-size: 13px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
    ✕ Transfer Failed
  </div>
  <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 20px;">
    Transaction Unsuccessful
  </h2>
  
  <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
    Hi ${name}, we were unable to process your transfer. <strong>No funds have been debited from your balance.</strong>
  </p>

  <!-- Details Card -->
  <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
    <table width="100%" style="font-size: 14px; border-collapse: collapse;">
      <tr>
        <td style="color: #64748b; padding-bottom: 8px;">Attempted Amount</td>
        <td align="right" style="color: #0f172a; font-weight: 600; font-size: 16px; padding-bottom: 8px;">$${amount}</td>
      </tr>
      <tr>
        <td style="color: #64748b; padding-bottom: 8px;">Recipient Account</td>
        <td align="right" style="color: #0f172a; font-family: monospace; font-size: 13px; padding-bottom: 8px;">${toAccount}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Status</td>
        <td align="right" style="color: #dc2626; font-weight: 600;">Failed</td>
      </tr>
    </table>
  </div>

  <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0;">
    Please double-check your account balance and recipient details before trying again. If the issue persists, reply directly to this email.
  </p>

  <p style="color: #64748b; font-size: 13px; margin: 0;">
    Best,<br>
    <strong>The Backend Ledger Team</strong>
  </p>
</div>
`;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
