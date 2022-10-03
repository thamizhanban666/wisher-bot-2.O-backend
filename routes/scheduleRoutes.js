const express = require("express");
const scheduleEmailer = require("../controllers/scheduleEmailController");
const router = express.Router();
const protect = require("../middleware/authToken");

router.post('/', protect, scheduleEmailer );

module.exports = router;