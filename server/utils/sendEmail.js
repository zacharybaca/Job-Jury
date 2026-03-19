import sgMail from "@sendgrid/mail";

const sendEmail = async (options) => {
  // 1. Initialize SendGrid with your API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // 2. Define the email payload
  const msg = {
    to: options.email, // This can now be ANY email address!
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // MUST match the Single Sender email you verified
    subject: options.subject,
    text: options.message,
  };

  try {
    // 3. Send the email
    await sgMail.send(msg);
    console.log("✉️ Email sent successfully via SendGrid");
  } catch (error) {
    console.error("SendGrid Error:", error);
    if (error.response) {
      console.error(error.response.body); // Prints detailed error if it fails
    }
    throw new Error("Email could not be sent.");
  }
};

export default sendEmail;
