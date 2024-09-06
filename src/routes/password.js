const express = require("express");
const router = express.Router();
const UserDoctor = require("../models/UserDoctor");
const UserPatient = require("../models/UserPatient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Unified change password route
router.post("/changepassword", async (req, res) => {
  const { oldPassword, newPassword, id, userType } = req.body;

  try {
    // Validate input
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required" });
    }

    // Find the user based on userType
    let user;
    if (userType === "doctor") {
      user = await UserDoctor.findById(id);
    } else if (userType === "patient") {
      user = await UserPatient.findById(id);
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password
    const isMatch = bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
