const express = require("express");
const router = express.Router();
const bloodOxygenController = require("../controllers/bloodOxygenController");

router.post("/", bloodOxygenController.addBloodOxygen);
router.get("/", bloodOxygenController.getAllBloodOxygen);
router.put("/:id", bloodOxygenController.editBloodOxygen);
router.delete("/:id", bloodOxygenController.deleteBloodOxygen);

module.exports = router;
