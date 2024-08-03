const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserDoctorSchema = new Schema(
  {
    userImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    userType: { type: String, default: "provider" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    speciality: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    patients: [{ type: Schema.Types.ObjectId, ref: "UserPatient" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDoctor", UserDoctorSchema);
