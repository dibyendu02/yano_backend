const express = require("express");
const router = express.Router();
const bloodPressureController = require("../controllers/bloodPressureController");

router.post("/add", bloodPressureController.addBloodPressure);
router.put("/edit/:id", bloodPressureController.editBloodPressure);
router.delete("/delete/:id", bloodPressureController.deleteBloodPressure);

module.exports = router;
