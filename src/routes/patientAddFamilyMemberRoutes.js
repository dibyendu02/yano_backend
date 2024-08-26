const express = require("express");
const { verifyToken } = require("../middlewares/VerifyToken");
const patientAddFamilyMemberControllers = require("../controllers/patientAddFamilyMemberControllers");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  patientAddFamilyMemberControllers.addFamilyMember
);

router.get(
  "/",
  verifyToken,
  patientAddFamilyMemberControllers.getFamilyMembers
);

router.get(
  "/:userId",
  verifyToken,
  patientAddFamilyMemberControllers.getFamilyMemberById
);

router.put(
  "/:userId",
  verifyToken,
  patientAddFamilyMemberControllers.updateFamilyMember
);

router.delete(
  "/:userId",
  verifyToken,
  patientAddFamilyMemberControllers.deleteFamilyMember
);

module.exports = router;
