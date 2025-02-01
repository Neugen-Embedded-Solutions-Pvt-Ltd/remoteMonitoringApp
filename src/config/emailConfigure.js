import nodeMailer from "nodemailer";
import dotenv from "dotenv";
import dotenv from "dotenv";
dotenv.config();
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
    to: "manoj.a.31929@gmail.com", //options.to,
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
