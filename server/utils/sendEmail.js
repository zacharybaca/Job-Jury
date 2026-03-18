import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1. Create a transporter using Apple's explicit server settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com',
    port: 587,
    secure: false, // true for 465, false for other ports (587 uses STARTTLS)
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email details
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email
  const info = await transporter.sendMail(message);
  console.log(`✉️ Email sent: ${info.messageId}`);
};

export default sendEmail;
