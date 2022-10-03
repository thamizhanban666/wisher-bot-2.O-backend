const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Token = require("../Models/token");
const sendEmail = require("../utils/sendEmail");

// signUp 
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({message:"Enter all the fields"});
  }

  try {
    
    // check whether the email is already exist in database
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({message:"Already registered... Login!"});
    }

    // bcrypting the password
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    // create a new user
    const user = await User.create(req.body);

    const token = await Token.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
    })

    const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`
    const html = `<div style="margin:10px;"><p>Click on the button below to verify your registration on wisher-bot</p><a href='${url}' style="background-color:green;color:#fff;border:2px solid #777;border-radius:6px;margin:20px 10px;padding:3px;text-decoration:none;">Verify</a></div>`
    sendEmail(user.email, "Verify email", html);
    
    if (user && token) {
      res.status(201).json({message: "An email sent to you please verify"});
    } else {
      res.status(400).json({message:"Server Error!"});
    }

  } catch (error) {
    res.status(400).json({message: "Enter a valid email"})
  }
}) 

// Login authorization
const authUser = asyncHandler(async (req, res) => {

  const { email } = req.body;
  // check whether the email is already exists
  const user = await User.findOne({ email });
  if (!user) res.status(404).json({ message: "Enter the registered e-mail" });
  
  //compare the passwords
  let compare = bcrypt.compareSync(req.body.password, user.password);
  if (!compare) res.status(401).json({message:"Password is wrong"});

  if (!user.verified) {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await Token.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex")
      })
    }
    const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`
    const html = `<div style="margin:10px;"><p>Click on the button below to verify your registration on wisher-bot</p><a href='${url}' style="background-color:green;color:#fff;border:2px solid #777;border-radius:6px;margin:20px 10px;padding:3px;text-decoration:none;">Verify</a></div>`

    sendEmail(user.email, "Verify email", html);    

    res.status(401).json({message: "An email sent to your account please verify"});
  }

  res.status(201).json({...user._doc,token:jwt.sign({ _id: user._doc._id }, process.env.JWT_SECRET_KEY)});
    
})

const verifyUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) res.status(400).json({ message: "Invalid link" });
    
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    })

    if (!token) res.status(400).json({ message: "Invalid link" });
    
    await User.updateOne({ _id: user._id, verified: true })
    await token.remove();
    res.status(200).json({message: "Email verified"})
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"})
  }
})

module.exports = { registerUser, authUser, verifyUser };