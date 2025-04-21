const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
    const msg = {
        to,
        from: 'hardwarehivebybuildsync@gmail.com', // Ensure this email is verified in SendGrid
        subject,
        text,
    };

    try {
        const response = await sgMail.send(msg);
        console.log('Email sent successfully:', response[0].statusCode);
    } catch (error) {
        console.error('Error sending email:', error.message);
        if (error.response) {
            console.error('Error details:', error.response.body);
        }
    }
};

module.exports = sendEmail;