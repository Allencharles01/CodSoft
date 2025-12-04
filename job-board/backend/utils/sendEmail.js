// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,       // e.g. smtp.gmail.com
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,                      // false for TLS/STARTTLS
      auth: {
        user: process.env.EMAIL_USER,     // your email
        pass: process.env.EMAIL_PASS,     // app password
      },
    });

    // Verify connection (shows full error if credentials are wrong)
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"CodSoft JobBoard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ FULL EMAIL ERROR:", err);
    throw err; // important: this allows route to return 500 properly
  }
}

export default sendEmail;
