const express = require("express");
const router = express.Router();
const {
  signup,
  doctorLogin,
  findDoctorById,
  getAllDoctors,
  updateDoctor,
  createPatient,
  findPatientByemail,
  addPatientInTheList,
} = require("../controllers/userDoctorControllers");
const { singleUpload } = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/VerifyToken");

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
router.post("/create-patient/:id", verifyToken, singleUpload, createPatient);

router.post("/find-patient-by-email", verifyToken, findPatientByemail);

router.put("/add-patient-in-list/:doctorId", verifyToken, addPatientInTheList);

module.exports = router;
