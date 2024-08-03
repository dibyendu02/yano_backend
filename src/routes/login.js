const express = require("express");
const router = express.Router();
const UserDoctor = require("../models/UserDoctor");
const UserPatient = require("../models/UserPatient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Unified login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists in UserDoctor collection
    let user = await UserDoctor.findOne({ email });
    let userType = "doctor";

    // If not found in UserDoctor, check UserPatient
    if (!user) {
      user = await UserPatient.findOne({ email });
      userType = "patient";
    }

    // If user is not found in both collections
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({
      message: "Login successful",
      userData: user,
      userType,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
