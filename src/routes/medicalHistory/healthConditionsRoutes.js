const express = require("express");
const router = express.Router();
const healthConditionsController = require("../../controllers/medicalHistory/healthConditionsController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new health condition
router.post("/", verifyToken, healthConditionsController.createHealthCondition);

// Get all health conditions for a user
router.get(
  "/:userId",
  verifyToken,
  healthConditionsController.getHealthConditions
);

// Get a specific health condition
router.get(
  "/:userId/:id",
  verifyToken,
  healthConditionsController.getHealthConditionById
);

// Update a specific health condition
router.put(
  "/:userId/:id",
  verifyToken,
  healthConditionsController.updateHealthCondition
);

// Delete a specific health condition
router.delete(
  "/:userId/:id",
  verifyToken,
  healthConditionsController.deleteHealthCondition
);

module.exports = router;
