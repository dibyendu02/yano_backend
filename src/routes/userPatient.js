const express = require("express");
const router = express.Router();
const {
  patientSignup,
  patientLogin,
  findPatientById,
  getAllPatients,
} = require("../controllers/userPatientControllers");
const { singleUpload } = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/VerifyToken");

// Signup route
router.post("/signup", singleUpload, patientSignup);
//login
router.post("/login", patientLogin);
// verify
// router.post("/phone-verify", verifyToken, verifyPhone);
// Find patient by ID route
router.get("/:id", findPatientById);

//get all patients
router.get("/", getAllPatients);

module.exports = router;
