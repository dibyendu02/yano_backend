const mongoose = require("mongoose");
const UserPatient = require("../models/UserPatient");
const UserDoctor = require("../models/UserDoctor");
const bcrypt = require("bcryptjs");

// Change password
exports.changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    let userCre;

    // Find the user based on their type using aggregation
    if (user.userType === "doctor") {
      userCre = await UserDoctor.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(user.id) } },
        {
          $project: {
            password: 1,
          },
        },
      ]);
    } else if (user.userType === "patient") {
      userCre = await UserPatient.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(user.id) } },
        {
          $project: {
            password: 1,
          },
        },
      ]);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!userCre || userCre.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const userDoc = userCre[0];

    const validPassword = await bcrypt.compare(oldPassword, userDoc.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await (user.userType === "doctor" ? UserDoctor : UserPatient).updateOne(
      { _id: mongoose.Types.ObjectId(user.id) },
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
