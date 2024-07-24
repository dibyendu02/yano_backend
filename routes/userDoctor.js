const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/userDoctorControllers");
const { singleUpload } = require("../middlewares/multer");

// Signup route
router.post("/signup", singleUpload, signup);

module.exports = router;
