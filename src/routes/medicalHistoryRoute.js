const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../controllers/medicalHistoryController");
const { verifyToken } = require("../middlewares/VerifyToken");

// Create a new medical history
router.post("/", verifyToken, medicalHistoryController.createMedicalHistory);

// Get all medical history
router.get("/:userId", verifyToken, medicalHistoryController.getMedicalHistory);

module.exports = router;
