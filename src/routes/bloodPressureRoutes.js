const express = require("express");
const router = express.Router();
const bloodPressureController = require("../controllers/bloodPressureController");

router.post("/", bloodPressureController.addBloodPressure);
router.get("/", bloodPressureController.getAllBloodPressureRecords);
router.put("/:id", bloodPressureController.editBloodPressure);
router.delete("/:id", bloodPressureController.deleteBloodPressure);

module.exports = router;
