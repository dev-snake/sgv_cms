import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendThankYouEmail(email: string, name: string) {
  const subject = "Cảm ơn bạn đã liên hệ với chúng tôi";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Chào ${name},</h2>
      <p>Cảm ơn bạn đã gửi tin nhắn cho chúng tôi qua website. Chúng tôi đã nhận được thông tin liên hệ của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
      <p>Thông tin của bạn:</p>
      <ul>
        <li>Họ tên: ${name}</li>
        <li>Email: ${email}</li>
      </ul>
      <p>Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}
