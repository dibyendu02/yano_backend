const express = require("express");
const router = express.Router();
const ecgController = require("../controllers/ecgController");

router.post("/add", ecgController.addECG);
router.put("/edit/:id", ecgController.editECG);
router.delete("/delete/:id", ecgController.deleteECG);

module.exports = router;
