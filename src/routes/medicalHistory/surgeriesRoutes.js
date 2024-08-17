const express = require("express");
const router = express.Router();
const surgeriesController = require("../../controllers/medicalHistory/surgeriesController");

// Create a new surgery
router.post("/", surgeriesController.createSurgery);

// Get all surgeries for a user
router.get("/:userId", surgeriesController.getSurgeries);

// Get a specific surgery
router.get("/:userId/:id", surgeriesController.getSurgeryById);

// Update a specific surgery
router.put("/:userId/:id", surgeriesController.updateSurgery);

// Delete a specific surgery
router.delete("/:userId/:id", surgeriesController.deleteSurgery);

module.exports = router;
