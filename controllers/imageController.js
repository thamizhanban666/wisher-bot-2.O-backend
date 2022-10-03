const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const Image = require("../Models/image");

const postImage = asyncHandler(async (req, res) => {
  const { userId, url } = req.body;

  // check userId and url exists
  const userExist = await User.findById(userId);
  if (!userExist || !url) {
    res.status(404).json({message:"User not exists or url is not there"});
  }
  
  // post new image
  await Image.create(req.body);
  res.status(201).json({ message: "Image added successfully" });
})

const getAllImages = asyncHandler(async (req, res) => {
  let images = await Image.find();

  if (!images) res.status(500).json({ message: "Server Error" })
  
  res.status(200).json(images);
})

module.exports = { postImage, getAllImages };