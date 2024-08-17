const express = require("express");
const router = express.Router();
const hospitalizationsController = require("../../controllers/medicalHistory/hospitalizationsController");

// Create a new hospitalization record
router.post("/", hospitalizationsController.createHospitalization);

// Get all hospitalizations for a user
router.get("/:userId", hospitalizationsController.getHospitalizations);

// Get a specific hospitalization record
router.get("/:userId/:id", hospitalizationsController.getHospitalizationById);

// Update a specific hospitalization record
router.put("/:userId/:id", hospitalizationsController.updateHospitalization);

// Delete a specific hospitalization record
router.delete("/:userId/:id", hospitalizationsController.deleteHospitalization);

module.exports = router;
