const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const UserPatient = require("../models/UserPatient");
const { getDataUri } = require("../utils/feature"); // Adjust the path based on your project structure
// const twilio = require("twilio");
// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );
// const verifyServiceSid = process.env.VERIFY_SERVICE_SID;

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

    res.status(201).json({
      message: "Patient registered successfully",
      userData: newPatient,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.patientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await UserPatient.findOne({ email });
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

exports.findPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await UserPatient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ userData: patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.verifyPhone = async (req, res) => {
//   const { phone } = req.body;
//   try {
//     // Find or create user by phone number
//     let user = await UserPatient.findOne({ phoneNumber: phone });

//     if (!user) {
//       res.status(404).send({ success: false, error: "no user found" });
//     } else {
//       // Send OTP to the user's phone using Twilio Verify
//       const verification = await twilioClient.verify.v2 // .services(verifyServiceSid)
//         .services(verifyServiceSid)
//         .verifications.create({ to: phone, channel: "sms" });

//       console.log(verification.status);

//       console.log(`Sent verification: '${verification.sid}'`);
//       res
//         .status(200)
//         .send({ success: true, message: "OTP sent to your phone." });
//     }
//   } catch (error) {
//     res.status(500).send({ success: false, error: error });
//   }
// };
