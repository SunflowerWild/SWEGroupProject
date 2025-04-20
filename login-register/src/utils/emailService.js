const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, code) => {
    const msg = {
        to: email,
        from: 'hardwarehivebybuildsync@gmail.com',
        subject: 'Verify Your Email',
        text: `Your verification code is: ${code}`,
    };

    try {
        const response = await sgMail.send(msg);
        console.log('Email sent: ' + response[0].statusCode);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


module.exports = sendEmail;
