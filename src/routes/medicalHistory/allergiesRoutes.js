const express = require("express");
const router = express.Router();
const allergiesController = require("../../controllers/medicalHistory/allergiesController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new allergy
router.post("/", verifyToken, allergiesController.createAllergy);

// Get all allergies for a user
router.get("/:userId", verifyToken, allergiesController.getAllergies);

// Get a specific allergy
router.get("/:userId/:id", verifyToken, allergiesController.getAllergyById);

// Update a specific allergy
router.put("/:userId/:id", verifyToken, allergiesController.updateAllergy);

// Delete a specific allergy
router.delete("/:userId/:id", verifyToken, allergiesController.deleteAllergy);

module.exports = router;
