const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
var cron = require('node-cron');

const scheduleEmail = asyncHandler(async (details) => {
  let { email, name, subject, message, imgUrl, minute, hour, day, month } = details;

  cron.schedule(`${minute} ${hour} ${day} ${month} *`, () => {
  
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
        subject: `From: ${name} - ${ subject }`,
        html : `<div><img src='${imgUrl}'/><p>${message}</p></div>`
      }

        transporter.sendMail(mailOptions, (err) => {
        if (err) console.log(err);
        else console.log("Scheduled email sent successfully");
      });
        
    } catch (error) {
      console.log("Scheduled email is not sent");
      console.log(error)
    }
  });
})

module.exports = scheduleEmail;