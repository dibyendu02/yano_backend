const express = require("express");
const router = express.Router();
const {
  signup,
  doctorLogin,
  findDoctorById,
} = require("../controllers/userDoctorControllers");
const { singleUpload } = require("../middlewares/multer");

// Signup route
router.post("/signup", singleUpload, signup);
router.post("/login", doctorLogin);
// Find doctor by ID route
router.get("/:id", findDoctorById);

module.exports = router;
