const express = require("express");
const router = express.Router();
const hospitalizationsController = require("../../controllers/medicalHistory/hospitalizationsController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new hospitalization record
router.post("/", verifyToken, hospitalizationsController.createHospitalization);

// Get all hospitalizations for a user
router.get(
  "/:userId",
  verifyToken,
  hospitalizationsController.getHospitalizations
);

// Get a specific hospitalization record
router.get(
  "/:userId/:id",
  verifyToken,
  hospitalizationsController.getHospitalizationById
);

// Update a specific hospitalization record
router.put(
  "/:userId/:id",
  verifyToken,
  hospitalizationsController.updateHospitalization
);

// Delete a specific hospitalization record
router.delete(
  "/:userId/:id",
  verifyToken,
  hospitalizationsController.deleteHospitalization
);

module.exports = router;
