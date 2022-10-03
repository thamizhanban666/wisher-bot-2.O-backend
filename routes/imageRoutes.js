const express = require("express");
const { postImage, getAllImages } = require("../controllers/imageController");
const router = express.Router();
const protect = require("../middleware/authToken");

router.post('/', protect, postImage );
router.get('/', protect, getAllImages );

module.exports = router;