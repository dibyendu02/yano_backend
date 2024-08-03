const express = require("express");
const router = express.Router();
const heartRateController = require("../controllers/heartRateController");

router.post("/add", heartRateController.addHeartRate);
router.put("/edit/:id", heartRateController.editHeartRate);
router.delete("/delete/:id", heartRateController.deleteHeartRate);

module.exports = router;
