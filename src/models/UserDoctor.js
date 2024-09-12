const mongoose = require("mongoose");
const UserPatient = require("../models/UserPatient");

const { Schema } = mongoose;

const UserDoctorSchema = new Schema(
  {
    userImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    userType: {
      type: String,
      required: true, // Role name is required
      default: "doctor",
      set: (value) => value.toLowerCase(), // Convert input to lowercase before storing
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    speciality: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    patients: [{ type: Schema.Types.ObjectId, ref: "UserPatient" }],
    sessionCount: { type: Number, default: 0 },
    country: { type: String },
    permission: {
      canCreateNewUser: { type: Boolean, default: true },
      canEditUser: { type: Boolean, default: true },
      canSendMessage: { type: Boolean, default: true },
      canSendMessages: { type: Boolean, default: true },
      canExportMedicalReport: { type: Boolean, default: true },
      canExportBasicInfo: { type: Boolean, default: true },
      canViewMedicalRecord: { type: Boolean, default: true },
      canDeleteUser: { type: Boolean, default: false },
      canViewMedicalReports: { type: Boolean, default: false },
      canViewCountryReports: { type: Boolean, default: false },
      canExportReports: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDoctor", UserDoctorSchema);
