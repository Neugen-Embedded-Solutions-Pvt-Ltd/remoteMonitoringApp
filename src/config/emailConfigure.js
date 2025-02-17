import nodeMailer from "nodemailer";
/**
 * Sends an email using the specified options.
 *
 * @param {Object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.message - The HTML content of the email.
 *
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 *
 * @throws {Error} - Throws an error if the email fails to send.
 */
const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "manojarun4820@gmail.com",
      pass: "lsyy vdig cnje uifw",
    },
  });
  const mailOptions = {
    from: "manojarun4820@gmail.com",
    to: "manoj.a.31929@gmail.com",
    subject: options.subject,
    html: options.message,
  };
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export { sendEmail };
