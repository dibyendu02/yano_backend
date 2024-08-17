const express = require("express");
const router = express.Router();
const vaccinesController = require("../../controllers/medicalHistory/vaccinesController");

// Create a new vaccine record
router.post("/", vaccinesController.createVaccine);

// Get all vaccines for a user
router.get("/:userId", vaccinesController.getVaccines);

// Get a specific vaccine record
router.get("/:userId/:id", vaccinesController.getVaccineById);

// Update a specific vaccine record
router.put("/:userId/:id", vaccinesController.updateVaccine);

// Delete a specific vaccine record
router.delete("/:userId/:id", vaccinesController.deleteVaccine);

module.exports = router;
