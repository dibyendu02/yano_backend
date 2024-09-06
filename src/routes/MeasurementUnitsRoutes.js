const express = require("express");
const router = express.Router();
const {
  createMeasurementUnit,
  updateMeasurementUnit,
  getMeasurementUnitByUserId,
} = require("../controllers/measurementUnitsController");
const { verifyToken } = require("../middlewares/VerifyToken");

// Route to create a measurement unit
router.post("/", verifyToken, createMeasurementUnit);

// Route to update a measurement unit by userId
router.put("/:userId", verifyToken, updateMeasurementUnit);

// Route to get a measurement unit by userId
router.get("/:userId", verifyToken, getMeasurementUnitByUserId);

module.exports = router;
