const express = require("express");
const router = express.Router();
const medicinesController = require("../../controllers/medicalHistory/medicinesController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new medicine
router.post("/", verifyToken, medicinesController.createMedicine);

// Get all medicines for a user
router.get("/:userId", verifyToken, medicinesController.getMedicines);

// Get a specific medicine
router.get("/:userId/:id", verifyToken, medicinesController.getMedicineById);

// Update a specific medicine
router.put("/:userId/:id", verifyToken, medicinesController.updateMedicine);

// Delete a specific medicine
router.delete("/:userId/:id", verifyToken, medicinesController.deleteMedicine);

module.exports = router;
