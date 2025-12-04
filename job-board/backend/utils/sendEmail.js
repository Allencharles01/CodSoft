// backend/utils/sendEmail.js
// Real email sender using Resend HTTP API (works on Render, no SMTP)

const RESEND_API_URL = "https://api.resend.com/emails";

async function sendEmail(to, subject, text) {
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CodSoft JobBoard <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Resend API error:", res.status, errorText);
      throw new Error("Email sending failed");
    }

    const data = await res.json();
    console.log("📧 Email sent via Resend:", data);
    return data;
  } catch (err) {
    console.error("❌ Email error (Resend):", err);
    // we rethrow so callers can choose how to handle
    throw err;
  }
}

export default sendEmail;
