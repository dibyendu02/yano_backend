const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const UserDoctor = require("../models/UserDoctor");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/feature"); // Adjust the path based on your project structure
const UserPatient = require("../models/UserPatient");

exports.signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    dateOfBirth,
    speciality,
    userType, // Role name, optional
  } = req.body;

  try {
    // Validate required input
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Normalize userType (role name) to lowercase if provided, else default to 'doctor'
    const normalizedUserType = userType ? userType.toLowerCase() : "doctor";

    // Check if email already exists
    const existingEmail = await UserDoctor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if phone number already exists
    if (phoneNumber) {
      const existingPhoneNumber = await UserDoctor.findOne({ phoneNumber });
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

    // Create new doctor
    const newDoctor = new UserDoctor({
      userImg,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType: normalizedUserType, // Store the userType in lowercase
      phoneNumber,
      gender,
      dateOfBirth,
      speciality,
    });

    // Save the doctor to the database
    await newDoctor.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newDoctor._id, email: newDoctor.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in 7 days
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
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
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

exports.getAllDoctors = async (req, res) => {
  try {
    const users = await UserDoctor.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ userData: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDoctor = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if the doctor exists
    const doctor = await UserDoctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // If a password is being updated, hash it before saving
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // If a new image is uploaded, handle the upload to Cloudinary
    if (req.file) {
      // Upload new image to Cloudinary
      const fileUri = getDataUri(req.file).content;
      const result = await cloudinary.uploader.upload(fileUri);
      updates.userImg = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      // Optionally, delete the old image from Cloudinary
      if (doctor.userImg.public_id) {
        await cloudinary.uploader.destroy(doctor.userImg.public_id);
      }
    }

    // Update doctor with new data
    const updatedDoctor = await UserDoctor.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    res.status(200).json({
      message: "Doctor updated successfully",
      userData: updatedDoctor,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createPatient = async (req, res) => {
  console.log("Received file:", req.file);
  console.log("Update data:", req.body);
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, gender, dateOfBirth } =
      req.body;

    console.log(firstName, lastName, email, gender, dateOfBirth);

    const missingFields = [];

    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!email) missingFields.push("email");
    if (!gender) missingFields.push("gender");
    if (!dateOfBirth) missingFields.push("dateOfBirth");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message:
          "The following fields are missing: " + missingFields.join(", "),
      });
    }

    const doctor = await UserDoctor.findById(id);

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

    let userImg = {};
    if (req.file) {
      const fileUri = getDataUri(req.file).content;
      const result = await cloudinary.uploader.upload(fileUri);
      userImg.public_id = result.public_id;
      userImg.secure_url = result.secure_url;
    }

    // Create new patient
    const newPatient = await UserPatient.create({
      userImg,
      firstName,
      lastName,
      email,
      // phoneNumber,
      gender,
      dateOfBirth,
    });

    if (!newPatient) {
      console.log("Failed to create patient");
      return res.status(400).json({ message: "Failed to create patient" });
    }

    doctor.markModified("patients");

    await doctor.save();

    res.status(201).json({
      message: "Patient created successfully",
      userData: newPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
