const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.SECURE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    }); 
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: subject,
      html : html
    }

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.log(err);
      else console.log("Email sent successfully");
    })
    
  } catch (error) {
    console.log("Email not sent");
    console.log(error)
  }
})

module.exports = sendEmail;