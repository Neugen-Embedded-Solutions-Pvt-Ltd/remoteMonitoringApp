// OTP sender (not implemented)

const nodeMailer = require('nodemailer');

const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (options) => {

    const transporter  = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,  
    });
    
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.to,
        subject: options.subject,
        html: options.html
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