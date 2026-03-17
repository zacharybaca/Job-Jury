import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter (The Postman)
  // For development, Gmail is easiest. In production, you'd swap this for SendGrid or AWS SES.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, // e.g., your personal gmail
      pass: process.env.EMAIL_PASSWORD, // An App Password, NOT your real password
    },
  });

  // 2. Define the email details
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email, // This is where your testmail.app address will go during testing!
    subject: options.subject,
    text: options.message,
    // Optional: You can pass html: options.html to make it look pretty later
  };

  // 3. Send the email
  const info = await transporter.sendMail(message);
  console.log(`✉️ Email sent: ${info.messageId}`);
};

export default sendEmail;
