const express = require("express");
const router = express.Router();
const {
  signup,
  doctorLogin,
  findDoctorById,
  getAllDoctors,
  updateDoctor,
  createPatient,
} = require("../controllers/userDoctorControllers");
const { singleUpload } = require("../middlewares/multer");

// Signup route
router.post("/signup", singleUpload, signup);
//update
router.put("/:id", singleUpload, updateDoctor);
router.post("/login", doctorLogin);
// Find doctor by ID route
router.get("/:id", findDoctorById);

// get all doctors
router.get("/", getAllDoctors);

// post create doctor
router.post("/create-patient/:id", singleUpload, createPatient);

module.exports = router;
