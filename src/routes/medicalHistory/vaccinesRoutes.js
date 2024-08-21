const express = require("express");
const router = express.Router();
const vaccinesController = require("../../controllers/medicalHistory/vaccinesController");
const { verifyToken } = require("../../middlewares/VerifyToken");

// Create a new vaccine record
router.post("/", verifyToken, vaccinesController.createVaccine);

// Get all vaccines for a user
router.get("/:userId", verifyToken, vaccinesController.getVaccines);

// Get a specific vaccine record
router.get("/:userId/:id", verifyToken, vaccinesController.getVaccineById);

// Update a specific vaccine record
router.put("/:userId/:id", verifyToken, vaccinesController.updateVaccine);

// Delete a specific vaccine record
router.delete("/:userId/:id", verifyToken, vaccinesController.deleteVaccine);

module.exports = router;
