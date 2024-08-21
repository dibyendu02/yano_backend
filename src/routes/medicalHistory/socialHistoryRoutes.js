const express = require("express");
const router = express.Router();
const socialHistoryController = require("../../controllers/medicalHistory/socialHistoryController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new social history entry
router.post("/", verifyToken, socialHistoryController.createSocialHistory);

// Get all social history entries for a user
router.get("/:userId", verifyToken, socialHistoryController.getSocialHistories);

// Get a specific social history entry
router.get(
  "/:userId/:id",
  verifyToken,
  socialHistoryController.getSocialHistoryById
);

// Update a specific social history entry
router.put(
  "/:userId/:id",
  verifyToken,
  socialHistoryController.updateSocialHistory
);

// Delete a specific social history entry
router.delete(
  "/:userId/:id",
  verifyToken,
  socialHistoryController.deleteSocialHistory
);

module.exports = router;
