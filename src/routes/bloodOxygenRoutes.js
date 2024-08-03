const express = require("express");
const router = express.Router();
const bloodOxygenController = require("../controllers/bloodOxygenController");

router.post("/add", bloodOxygenController.addBloodOxygen);
router.put("/edit/:id", bloodOxygenController.editBloodOxygen);
router.delete("/delete/:id", bloodOxygenController.deleteBloodOxygen);

module.exports = router;
