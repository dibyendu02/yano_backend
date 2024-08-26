const express = require("express");
const router = express.Router();

const passwordController = require("../controllers/passwordChangeController");
const { verifyToken } = require("../middlewares/VerifyToken");

router.post("/change-password", verifyToken, passwordController.changePassword);

module.exports = router;
