const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const UserPatient = require("../models/UserPatient");
const { getDataUri } = require("../utils/feature"); // Adjust the path based on your project structure

exports.signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    password,
    height,
    weight,
    bloodType,
  } = req.body;

  try {
    // Validate input
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !gender ||
      !dateOfBirth ||
      !password ||
      !height ||
      !weight ||
      !bloodType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await UserPatient.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    let userImg = {};
    if (req.file) {
      const fileUri = getDataUri(req.file).content;
      const result = await cloudinary.uploader.upload(fileUri);
      userImg.public_id = result.public_id;
      userImg.secure_url = result.secure_url;
    }

    // Create new patient
    const newPatient = new UserPatient({
      userImg,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      password: hashedPassword,
      height,
      weight,
      bloodType,
      isEmailVerified: false,
      isPhoneVerified: false,
      devices: [], // Assuming devices array starts empty
    });

    // Save the patient to the database
    await newPatient.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newPatient._id, email: newPatient.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in
      }
    );

    res.status(201).json({ message: "Patient registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
