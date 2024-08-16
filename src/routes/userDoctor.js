const express = require("express");
const router = express.Router();
const {
  signup,
  doctorLogin,
  findDoctorById,
  getAllDoctors,
} = require("../controllers/userDoctorControllers");
const { singleUpload } = require("../middlewares/multer");

// Signup route
router.post("/signup", singleUpload, signup);
router.post("/login", doctorLogin);
// Find doctor by ID route
router.get("/:id", findDoctorById);

// get all doctors
router.get("/", getAllDoctors);

module.exports = router;
