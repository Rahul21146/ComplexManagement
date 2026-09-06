const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (toEmail, subject, htmlContent) => {

    const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: subject,
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };