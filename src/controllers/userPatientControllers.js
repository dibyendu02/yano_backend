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
  // if (
  //   !firstName ||
  //   !lastName ||
  //   !email ||
  //   !gender ||
  //   !dateOfBirth ||
  //   !password
  // ) {
  //   return res
  //     .status(400)
  //     .json({ message: "All required fields must be provided" });
  // }

  const missingFields = [];

  if (!firstName) missingFields.push("firstName");
  if (!lastName) missingFields.push("lastName");
  if (!email) missingFields.push("email");
  if (!gender) missingFields.push("gender");
  if (!dateOfBirth) missingFields.push("dateOfBirth");
  if (!password) missingFields.push("password");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "The following fields are missing: " + missingFields.join(", "),
    });
  }

  try {
    // Check if email already exists
    const existingEmail = await UserPatient.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if phone number already exists
    // if (phoneNumber) {
    //   const existingPhoneNumber = await UserPatient.findOne({ phoneNumber });
    //   if (existingPhoneNumber) {
    //     return res.status(400).json({ message: "Phone number already exists" });
    //   }
    // }

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

  console.log("Received file:", req.file); // This should log the file buffer and metadata
  console.log("Update data:", updateData); // Log form data

  try {
    let userImg = {};
    if (req.file) {
      const fileUri = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(fileUri);

      console.log("img uri ", result);

      userImg.public_id = result.public_id;
      userImg.secure_url = result.secure_url;
    }

    // Merge the uploaded image (if any) into the updateData object
    if (userImg.secure_url) {
      updateData.userImg = userImg;
    }

    // Find the patient by ID and update with the data provided in the request body
    const patient = await UserPatient.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      userData: patient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//create family member

exports.createFamilyMember = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    gender,
    relation,
    patientId,
  } = req.body;

  try {
    // Check if email already exists
    const existingEmail = await UserPatient.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Upload image to Cloudinary if provided
    let userImg = {};
    if (req.file) {
      const fileUri = getDataUri(req.file).content;
      const result = await cloudinary.uploader.upload(fileUri);
      userImg.public_id = result.public_id;
      userImg.secure_url = result.secure_url;
    }

    // Create a new patient account for the family member
    const newPatient = new UserPatient({
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      userType: "patient", // Ensuring the userType is "patient"
      userImg, // Add the image if uploaded
    });

    const savedPatient = await newPatient.save();

    // Link the newly created family member to the existing patient
    const existingPatient = await UserPatient.findById(patientId);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Add the family member link with full name and userImg
    existingPatient.familyLink.push({
      relation,
      name: `${savedPatient.firstName} ${savedPatient.lastName}`, // Full name
      userImg: savedPatient.userImg, // User image
      userId: savedPatient._id,
    });

    await existingPatient.save();

    res.status(201).json({
      message: "Family member created and linked successfully",
      familyMember: savedPatient,
      updatedPatient: existingPatient,
    });
  } catch (error) {
    console.error("Error creating family member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//link family member

exports.linkFamilyMember = async (req, res) => {
  const { patientId, familyMemberId } = req.params; // IDs of the existing patient and the family member
  const { relation } = req.body;

  try {
    // Find the existing patient by ID
    const existingPatient = await UserPatient.findById(patientId);

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Add the new patient's userId to the familyLink array with the relation
    existingPatient.familyLink.push({
      relation,
      userId: familyMemberId,
    });

    await existingPatient.save();

    res.status(200).json({
      message: "Family member linked successfully",
      updatedPatient: existingPatient,
    });
  } catch (error) {
    console.error("Error linking family member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//get family link data

exports.getFamilyLinkData = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId and populate the familyLink field
    const patient = await UserPatient.findById(userId);
    // .populate(
    //   "familyLink.userId",
    //   "firstName lastName userImg email dateOfBirth gender"
    // );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Return the familyLink data
    res.status(200).json({
      message: "Family link data retrieved successfully",
      familyLink: patient.familyLink,
    });
  } catch (error) {
    console.error("Error retrieving family link data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
