const express = require("express");
const router = express.Router();
const medicinesController = require("../../controllers/medicalHistory/medicinesController");

// Create a new medicine
router.post("/", medicinesController.createMedicine);

// Get all medicines for a user
router.get("/:userId", medicinesController.getMedicines);

// Get a specific medicine
router.get("/:userId/:id", medicinesController.getMedicineById);

// Update a specific medicine
router.put("/:userId/:id", medicinesController.updateMedicine);

// Delete a specific medicine
router.delete("/:userId/:id", medicinesController.deleteMedicine);

module.exports = router;
