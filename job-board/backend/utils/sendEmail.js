// backend/utils/sendEmail.js
// Real email sender using Resend API (not SMTP)

async function sendEmail(to, subject, text) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CodSoft JobBoard <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
    });

    const data = await res.json();
    console.log("📧 Email sent via Resend:", data);
    return data;
  } catch (err) {
    console.error("❌ Resend email error:", err);
    throw err;
  }
}

export default sendEmail;
