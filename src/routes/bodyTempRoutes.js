const express = require("express");
const router = express.Router();
const bodyTempController = require("../controllers/bodyTempController");

router.post("/", bodyTempController.addBodyTemp);
router.get("/", bodyTempController.getAllBodyTemps);
router.put("/:id", bodyTempController.editBodyTemp);
router.delete("/:id", bodyTempController.deleteBodyTemp);

module.exports = router;
