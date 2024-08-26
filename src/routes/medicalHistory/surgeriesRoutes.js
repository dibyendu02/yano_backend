const express = require("express");
const router = express.Router();
const surgeriesController = require("../../controllers/medicalHistory/surgeriesController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new surgery
router.post("/", verifyToken, surgeriesController.createSurgery);

// Get all surgeries for a user
router.get("/:userId", verifyToken, surgeriesController.getSurgeries);

// Get a specific surgery
router.get("/:userId/:id", verifyToken, surgeriesController.getSurgeryById);

// Update a specific surgery
router.put("/:userId/:id", verifyToken, surgeriesController.updateSurgery);

// Delete a specific surgery
router.delete("/:userId/:id", verifyToken, surgeriesController.deleteSurgery);

module.exports = router;
