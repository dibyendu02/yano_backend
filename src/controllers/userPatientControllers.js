const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const UserPatient = require("../models/UserPatient");
const MedicalHistory = require("../models/MedicalHistory");
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

//update patient
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    let userImg = {};
    if (req.file) {
      const fileUri = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(fileUri);

      userImg.public_id = result.public_id;
      userImg.secure_url = result.secure_url;
    }

    // Merge the uploaded image (if any) into the updateData object
    if (userImg.secure_url) {
      updateData.userImg = userImg;
    }

    // Find the patient by ID
    const patient = await UserPatient.findById(id);
    if (!patient) {
      console.log("patient not found");
      return res.status(404).json({ message: "Patient not found" });
    }

    // Conditionally update each field if it exists in the request body
    if (updateData.firstName) patient.firstName = updateData.firstName;
    if (updateData.lastName) patient.lastName = updateData.lastName;
    if (updateData.email) patient.email = updateData.email;
    if (updateData.phoneNumber) patient.phoneNumber = updateData.phoneNumber;
    if (updateData.gender) patient.gender = updateData.gender;
    if (updateData.dateOfBirth)
      patient.dateOfBirth = new Date(updateData.dateOfBirth);
    if (updateData.height) patient.height = updateData.height;
    if (updateData.weight) patient.weight = updateData.weight;
    if (updateData.bloodType) patient.bloodType = updateData.bloodType;
    if (updateData.isActive !== undefined)
      patient.isActive = updateData.isActive;
    if (updateData.emergencyContactName)
      patient.emergencyContactName = updateData.emergencyContactName;
    if (updateData.emergencyContactPhone)
      patient.emergencyContactPhone = updateData.emergencyContactPhone;

    // Only process device data if it exists in the request
    if (req.body.devices && req.body.devices.length > 0) {
      const glucometerIndex = patient.devices.findIndex(
        (device) => device.deviceType === "glucometer"
      );

      if (glucometerIndex !== -1) {
        // Update the serial number of the existing glucometer
        patient.devices[glucometerIndex].deviceSerialNumber =
          req.body.devices[0].deviceSerialNumber;
      } else {
        // Add the new device to the list if no glucometer exists
        patient.devices.push(req.body.devices[0]);
      }
    }

    // Save the updated patient data
    const updatedPatient = await patient.save();

    res.status(200).json({
      message: "Patient updated successfully",
      userData: updatedPatient,
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

// POST /api/patients/:patientId/family-link
exports.linkFamilyMember = async (req, res) => {
  const { patientId } = req.params; // ID of the existing patient to link the family member to
  const { relation, firstName, lastName, userImg, familyMemberUserId } =
    req.body; // Details of the family member

  console.log(relation);
  console.log(firstName);
  console.log(lastName);
  console.log(familyMemberUserId);

  try {
    // Ensure that all required fields are provided
    if (!relation || !firstName || !lastName || !familyMemberUserId) {
      console.log("field missing");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the existing patient by ID
    const existingPatient = await UserPatient.findById(patientId);

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if the family member is already linked to the patient
    const isAlreadyLinked = existingPatient.familyLink.some(
      (link) => link.userId.toString() === familyMemberUserId
    );

    if (isAlreadyLinked) {
      console.log("already linked");
      return res
        .status(400)
        .json({ message: "Family member is already linked to this patient" });
    }

    // Add the family member to the patient's familyLink array
    existingPatient.familyLink.push({
      relation,
      name: `${firstName} ${lastName}`, // Full name
      userImg, // Family member's user image (can be an URL or base64 string)
      userId: familyMemberUserId, // Family member's user ID
    });

    // Save the updated patient document
    await existingPatient.save();

    // Respond with success and the updated familyLink
    res.status(200).json({
      message: "Family member linked successfully",
      updatedPatient: existingPatient,
    });
  } catch (error) {
    console.error("Error linking family member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/patients/:patientId/family-link/:familyMemberUserId
exports.removeFamilyMember = async (req, res) => {
  const { patientId, familyMemberUserId } = req.params;

  console.log(patientId);

  try {
    // Find the existing patient by ID
    const existingPatient = await UserPatient.findById(patientId);

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if the family member is linked to the patient
    const familyMemberIndex = existingPatient.familyLink.findIndex(
      (link) => link.userId.toString() === familyMemberUserId
    );

    if (familyMemberIndex === -1) {
      return res.status(404).json({
        message: "Family member not found in the patient's family link",
      });
    }

    // Remove the family member from the familyLink array
    existingPatient.familyLink.splice(familyMemberIndex, 1);

    // Save the updated patient document
    await existingPatient.save();

    // Respond with success and the updated familyLink
    res.status(200).json({
      message: "Family member removed successfully",
      updatedPatient: existingPatient,
    });
  } catch (error) {
    console.error("Error removing family member:", error);
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

exports.findPatientByemail = async (req, res) => {
  try {
    const { email } = req.body;
    const patient = await UserPatient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ userData: patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePatientData = async (req, res) => {
  const { userId } = req.params;

  try {
    // Step 1: Delete specific fields (height, weight, bloodType) from UserPatient
    const updatedPatient = await UserPatient.findByIdAndUpdate(
      userId,
      { $unset: { height: "", weight: "", bloodType: "" } },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Step 2: Delete the entire MedicalHistory document for the user
    const medicalHistoryDeleted = await MedicalHistory.findOneAndDelete({
      userId,
    });

    // Step 3: Delete all related records from other collections
    // Note: This is optional if those records are only stored in the embedded subdocuments
    // await HealthConditions.deleteMany({ userId });
    // await FamilyHistory.deleteMany({ userId });
    // await Allergies.deleteMany({ userId });
    // await Medicine.deleteMany({ userId });
    // await Surgeries.deleteMany({ userId });
    // await Vaccine.deleteMany({ userId });
    // await Hospitalizations.deleteMany({ userId });
    // await SocialHistory.deleteMany({ userId });

    res.status(200).json({
      message: "Patient data and all medical histories deleted successfully",
      userData: updatedPatient,
      medicalHistoryDeleted,
    });
  } catch (error) {
    console.error("Error deleting patient data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUserAccount = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    // Step 1: Find the user by ID
    const user = await UserPatient.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Verify the provided password with the stored hashed password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Step 3: Delete all associated medical history
    await MedicalHistory.findOneAndDelete({ userId });

    // await HealthConditions.deleteMany({ userId });
    // await FamilyHistory.deleteMany({ userId });
    // await Allergies.deleteMany({ userId });
    // await Medicine.deleteMany({ userId });
    // await Surgeries.deleteMany({ userId });
    // await Vaccine.deleteMany({ userId });
    // await Hospitalizations.deleteMany({ userId });
    // await SocialHistory.deleteMany({ userId });

    // Step 4: Delete the user account
    await UserPatient.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User account and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await UserPatient.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches and has not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark email as verified and clear OTP fields
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addGlucometer = async (req, res) => {
  const { userId } = req.params;
  const glucometerData = req.body;

  console.log(glucometerData);

  try {
    const patient = await UserPatient.findById(userId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const glucometerIndex = patient.devices.findIndex(
      (device) => device.deviceType === "glucometer"
    );
    if (glucometerIndex == -1) {
      patient.devices.push(glucometerData);
    } else {
      return res
        .status(500)
        .json({ message: "Patient already have glucometer" });
    }

    // Save the updated patient data
    const updatedPatient = await patient.save();

    res.status(200).json({
      message: "glucometer added successfully",
      userData: updatedPatient,
    });
  } catch (error) {
    console.error("Error deleting glucometer:", error);
    res.status(404).json({ message: "Server error" });
  }
};

exports.deleteGlucometer = async (req, res) => {
  const { userId } = req.params;
  // console.log(userId);
  try {
    const patient = await UserPatient.findById(userId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const glucometerIndex = patient.devices.findIndex(
      (device) => device.deviceType === "glucometer"
    );
    if (glucometerIndex == -1) {
      return res
        .status(404)
        .json({ message: "Patient doesnot have any glucometer" });
    } else {
      patient.devices.pop();
    }

    // Save the updated patient data
    const updatedPatient = await patient.save();

    res.status(200).json({
      message: "glucometer device deleted successfully",
      userData: updatedPatient,
    });
  } catch (error) {
    console.error("Error deleting glucometer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
