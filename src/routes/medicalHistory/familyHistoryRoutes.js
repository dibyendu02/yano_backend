const express = require("express");
const router = express.Router();
const familyHistoryController = require("../../controllers/medicalHistory/familyHistoryController");

// Create a new family history entry
router.post("/", familyHistoryController.createFamilyHistory);

// Get all family history entries for a user
router.get("/:userId", familyHistoryController.getFamilyHistories);

// Get a specific family history entry
router.get("/:userId/:id", familyHistoryController.getFamilyHistoryById);

// Update a specific family history entry
router.put("/:userId/:id", familyHistoryController.updateFamilyHistory);

// Delete a specific family history entry
router.delete("/:userId/:id", familyHistoryController.deleteFamilyHistory);

module.exports = router;
