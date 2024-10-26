// OTP sender (not implemented)

const nodeMailer = require('nodemailer');

const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "manojarun4820@gmail.com",
            pass: "dguu bmkv fbfw osjl",
        }

    });

    const mailOptions = {
        from: "manojarun4820@gmail.com",
        to:"manojclick48@gmail.com",
        subject: options.subject,
        html: options.message
    }

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
module.exports = sendEmail;