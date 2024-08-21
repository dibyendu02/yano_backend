const express = require("express");
const router = express.Router();
const familyHistoryController = require("../../controllers/medicalHistory/familyHistoryController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new family history entry
router.post("/", verifyToken, familyHistoryController.createFamilyHistory);

// Get all family history entries for a user
router.get("/:userId", verifyToken, familyHistoryController.getFamilyHistories);

// Get a specific family history entry
router.get(
  "/:userId/:id",
  verifyToken,
  familyHistoryController.getFamilyHistoryById
);

// Update a specific family history entry
router.put(
  "/:userId/:id",
  verifyToken,
  familyHistoryController.updateFamilyHistory
);

// Delete a specific family history entry
router.delete(
  "/:userId/:id",
  verifyToken,
  familyHistoryController.deleteFamilyHistory
);

module.exports = router;
