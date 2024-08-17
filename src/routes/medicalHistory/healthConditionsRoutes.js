const express = require("express");
const router = express.Router();
const healthConditionsController = require("../../controllers/medicalHistory/healthConditionsController");

// Create a new health condition
router.post("/", healthConditionsController.createHealthCondition);

// Get all health conditions for a user
router.get("/:userId", healthConditionsController.getHealthConditions);

// Get a specific health condition
router.get("/:userId/:id", healthConditionsController.getHealthConditionById);

// Update a specific health condition
router.put("/:userId/:id", healthConditionsController.updateHealthCondition);

// Delete a specific health condition
router.delete("/:userId/:id", healthConditionsController.deleteHealthCondition);

module.exports = router;
