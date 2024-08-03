const express = require("express");
const router = express.Router();
const bodyTempController = require("../controllers/bodyTempController");

router.post("/add", bodyTempController.addBodyTemp);
router.put("/edit/:id", bodyTempController.editBodyTemp);
router.delete("/delete/:id", bodyTempController.deleteBodyTemp);

module.exports = router;
