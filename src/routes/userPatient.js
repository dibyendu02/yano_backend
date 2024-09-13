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
} = require("../controllers/userPatientControllers");
const { singleUpload } = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/VerifyToken");

// Signup route
router.post("/signup", singleUpload, patientSignup);

//login
// router.post("/login", patientLogin);
// verify
// router.post("/phone-verify", verifyToken, verifyPhone);

// Find patient by ID route
router.get("/:id", findPatientById);

// update patient by ID route
router.put("/:id", singleUpload, updatePatient);

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

module.exports = router;
