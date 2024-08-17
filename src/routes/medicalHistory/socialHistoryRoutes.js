const express = require("express");
const router = express.Router();
const socialHistoryController = require("../../controllers/medicalHistory/socialHistoryController");

// Create a new social history entry
router.post("/", socialHistoryController.createSocialHistory);

// Get all social history entries for a user
router.get("/:userId", socialHistoryController.getSocialHistories);

// Get a specific social history entry
router.get("/:userId/:id", socialHistoryController.getSocialHistoryById);

// Update a specific social history entry
router.put("/:userId/:id", socialHistoryController.updateSocialHistory);

// Delete a specific social history entry
router.delete("/:userId/:id", socialHistoryController.deleteSocialHistory);

module.exports = router;
