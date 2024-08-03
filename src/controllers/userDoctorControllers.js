const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const UserDoctor = require("../models/UserDoctor");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/feature"); // Adjust the path based on your project structure

exports.signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    speciality,
    password,
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
      !speciality ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await UserDoctor.findOne({ email });
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

    // Create new doctor
    const newDoctor = new UserDoctor({
      userImg,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      speciality,
      password: hashedPassword,
    });

    // Save the doctor to the database
    await newDoctor.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newDoctor._id, email: newDoctor.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in
      }
    );

    res.status(201).json({
      message: "Doctor registered successfully",
      userData: newDoctor,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await UserDoctor.findOne({ email });
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
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res
      .status(200)
      .json({ message: "Login successful", userData: user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.findDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await UserDoctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ userData: doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
