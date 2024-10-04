const express = require("express");
const router = express.Router();
const {
  patientSignup,
  patientLogin,
  findPatientById,
  getAllPatients,
  updatePatient,
  createFamilyMember,
  linkFamilyMember,
  getFamilyLinkData,
  findPatientByemail,
  removeFamilyMember,
  deletePatientData,
  deleteUserAccount,
  verifyEmailOTP,
  deleteGlucometer,
  addGlucometer,
} = require("../controllers/userPatientControllers");
const { singleUpload } = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/VerifyToken");
const {
  sendEmailPatientData,
  sendEmailVerificationOTP,
} = require("../controllers/sendEmail");

// Signup route
router.post("/signup", singleUpload, patientSignup);

//login
// router.post("/login", patientLogin);
// verify
// router.post("/phone-verify", verifyToken, verifyPhone);

// Find patient by ID route
router.get("/:id", findPatientById);

// Find patient by ID route and send email
router.get("/send-email/:id", sendEmailPatientData);

// update patient by ID route
router.put("/:id", singleUpload, verifyToken, updatePatient);

//get all patients
router.get("/", getAllPatients);

// Route to create a new family member account
router.post("/addfamilylink", singleUpload, verifyToken, createFamilyMember);

// Route to link the new family member to an existing patient
router.post("/:patientId/family-link", linkFamilyMember);

// Route to get family link data
router.get("/:userId/getfamilylink", verifyToken, getFamilyLinkData);

// Route to find patient by email
router.post("/find-patient-by-email", verifyToken, findPatientByemail);

// Route to remove a family member from the family link
router.delete(
  "/:patientId/family-link/:familyMemberUserId",
  removeFamilyMember
);

// Route to delete specific patient data and medical histories
router.delete("/delete-data/:userId", verifyToken, deletePatientData);

// Route to delete user account with password verification
router.post("/delete-account/:userId", verifyToken, deleteUserAccount);

// Route to send email OTP
router.post("/send-otp", sendEmailVerificationOTP);

// Route to verify email OTP
router.post("/verify-otp", verifyEmailOTP);

//remove glucometer
router.post("/glucometer/:userId", verifyToken, addGlucometer);

//remove glucometer
router.delete("/glucometer/:userId", verifyToken, deleteGlucometer);

module.exports = router;
