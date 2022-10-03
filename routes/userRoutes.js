const express = require("express");
const { registerUser, authUser, verifyUser } = require("../controllers/userController");
const protect = require("../middleware/authToken");
const router = express.Router();

router.post('/signup', registerUser);
router.get('/:id/verify/:token', verifyUser);
router.post('/login', authUser);
// router.get('/',protect, allUsers);

module.exports = router;