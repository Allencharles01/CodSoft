// backend/utils/sendEmail.js

// NOTE: This is a mock email sender for deployed environment (Render).
// It does NOT actually send emails, because Render blocks SMTP ports.
// Instead, it just logs the email data so the rest of the app works.

async function sendEmail(to, subject, text) {
  try {
    console.log("📧 [MOCK EMAIL SENT]");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:\n", text);
    // Return a fake info object like nodemailer would
    return {
      accepted: [to],
      messageId: "mock-" + Date.now(),
    };
  } catch (err) {
    console.error("❌ Mock email error:", err);
    // Don’t throw here – keep main request flowing
  }
}

export default sendEmail;
