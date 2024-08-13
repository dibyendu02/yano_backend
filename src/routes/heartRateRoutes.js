const express = require("express");
const router = express.Router();
const heartRateController = require("../controllers/heartRateController");

router.post("/", heartRateController.addHeartRate);
router.get("/", heartRateController.getAllHeartRates);
router.put("/:id", heartRateController.editHeartRate);
router.delete("/:id", heartRateController.deleteHeartRate);

module.exports = router;
