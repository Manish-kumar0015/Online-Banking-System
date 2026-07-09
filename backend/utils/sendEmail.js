const nodemailer = require("nodemailer");

// Create a reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

// Send an email with the given recipient, subject, and message
const sendEmail = async (

    to,

    subject,

    text

) => {

    try {

        await transporter.sendMail({

            // Sender email address
            from: process.env.EMAIL_USER,

            // Recipient email address
            to,

            // Email subject
            subject,

            // Plain text email body
            text

        });

        console.log("✅ Email Sent Successfully");

    }

    catch (error) {

        // Log any error that occurs during email sending
        console.log("❌ Email Error");

        console.log(error);

    }

};

module.exports = sendEmail;