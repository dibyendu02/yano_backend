const express = require("express");
const router = express.Router();
const bloodGlucoseController = require("../controllers/bloodGlucoseController");

router.post("/add", bloodGlucoseController.addBloodGlucose);
router.put("/edit/:id", bloodGlucoseController.editBloodGlucose);
router.delete("/delete/:id", bloodGlucoseController.deleteBloodGlucose);

module.exports = router;
