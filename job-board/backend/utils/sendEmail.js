// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

async function sendEmail(to, subject, text) {
  try {
    // create transporter using your SMTP service
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,      // e.g. "smtp.gmail.com"
      port: process.env.EMAIL_PORT || 587,
      secure: false,                     // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,    // your email address
        pass: process.env.EMAIL_PASS,    // app password or SMTP password
      },
    });

    const mailOptions = {
      from: `"CodSoft JobBoard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    // do NOT throw, so that main request doesn’t fail just because email failed
  }
}

export default sendEmail;
