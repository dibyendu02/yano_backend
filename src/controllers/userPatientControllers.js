const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const UserPatient = require("../models/UserPatient");
const { getDataUri } = require("../utils/feature"); // Adjust the path based on your project structure

exports.patientSignup = async (req, res) => {
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
    country, // New field
    familyLink, // New field
  } = req.body;

  // Check for missing required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !gender ||
    !dateOfBirth ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    // Check if email already exists
    const existingEmail = await UserPatient.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if phone number already exists
    if (phoneNumber) {
      const existingPhoneNumber = await UserPatient.findOne({ phoneNumber });
      if (existingPhoneNumber) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
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
      country, // Added country
      familyLink, // Added familyLink
      sessionCount: 0, // Default value
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

    res.status(201).json({
      message: "Patient registered successfully",
      userData: newPatient,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// exports.patientLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Validate input
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }

//     // Check if user exists
//     const user = await UserPatient.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" } // Token expires in 7 days
//     );

//     res
//       .status(200)
//       .json({ message: "Login successful", userData: user, token });
//   } catch (error) {
//     console.error("Error during patient login:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.findPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await UserPatient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ userData: patient });
  } catch (error) {
    console.error("Error finding patient by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await UserPatient.find();

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json({ userData: patients });
  } catch (error) {
    console.error("Error retrieving patients:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Find the patient by ID and update with the data provided in the request body
    const patient = await UserPatient.findByIdAndUpdate(
      id,
      { $set: updateData }
      // { new: true, runValidators: true } // Return the updated document and run validators
    );

    console.log(patient);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res
      .status(200)
      .json({ message: "Patient updated successfully", userData: patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};
