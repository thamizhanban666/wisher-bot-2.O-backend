const asyncHandler = require("express-async-handler");
// const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

// middlewares
const protect = asyncHandler(async (req, res, next) => {
 
  if (req.headers.authorization) {
    let decode = jwt.verify(req.headers.authorization, "anySecretKey");
    if (decode) {
      next();
    } else {
      res.status(401).json({ error: "Authentication error - token is invalid" });
    }
  } else {
    res.status(401).json({ error:"Authentication error - header does not have a token" });
  }
})

module.exports = protect;