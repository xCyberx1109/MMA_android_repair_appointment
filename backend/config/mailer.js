const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "hieupg12@gmail.com",
        pass: "rxobwjudrjjitcyp"
    }
});

const sendNewPassword = async (email, password) => {
    await transporter.sendMail({
        from: "Repair App",
        to: email,
        subject: "Your New Password",
        html: `
      <h3>Your new password</h3>
      <p>Password: <b>${password}</b></p>
      <p>Please login and change your password.</p>
    `
    });
};

module.exports = sendNewPassword;
