const asyncHandler = require("express-async-handler");
const scheduleEmail = require("../utils/scheduleEmail");

const scheduleEmailer = asyncHandler(async (req, res) => {

  const { email, name, subject, message, imgUrl, minute, hour, day, month } = req.body;

  if (!name || !email || !subject || !message || !imgUrl || !minute || !hour || !day || !month) {
    res.status(400).json({ message: "Enter all the fields" });
  }

  scheduleEmail(req.body);

});
  
module.exports = scheduleEmailer;