const express = require("express");
const router = express.Router();
const bloodGlucoseController = require("../controllers/bloodGlucoseController");
const { verifyToken } = require("../middlewares/VerifyToken");

router.post("/", verifyToken, bloodGlucoseController.addBloodGlucose);
router.get("/", verifyToken, bloodGlucoseController.getAllBloodGlucoseRecords);
router.get(
  "/:userId",
  verifyToken,
  bloodGlucoseController.getBloodGlucoseByUser
);
router.put("/:id", bloodGlucoseController.editBloodGlucose);
router.delete("/:id", bloodGlucoseController.deleteBloodGlucose);

module.exports = router;
