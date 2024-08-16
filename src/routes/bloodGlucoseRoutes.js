const express = require("express");
const router = express.Router();
const bloodGlucoseController = require("../controllers/bloodGlucoseController");

router.post("/", bloodGlucoseController.addBloodGlucose);
router.get("/", bloodGlucoseController.getAllBloodGlucoseRecords);
router.put("/:id", bloodGlucoseController.editBloodGlucose);
router.delete("/:id", bloodGlucoseController.deleteBloodGlucose);

module.exports = router;
