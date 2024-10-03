const mongoose = require("mongoose");
const UserDoctor = require("../models/UserDoctor");

const { Schema } = mongoose;

const DeviceSchema = new Schema({
  deviceName: { type: String, required: true },
  deviceSerialNumber: { type: String, required: true },
  deviceType: { type: String, required: true },
  lastSynced: { type: Date },
});

const FamilyLinkSchema = new Schema({
  name: { type: String },
  userImg: {
    public_id: { type: String },
    secure_url: { type: String },
  },
  relation: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserPatient",
    required: true,
  },
});

const UserPatientSchema = new Schema(
  {
    userImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    userType: { type: String, default: "patient" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    password: { type: String },
    phoneNumber: { type: String },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "UserDoctor" },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    height: { type: Number },
    weight: { type: Number },
    bloodType: { type: String },
    devices: [DeviceSchema],
    sessionCount: { type: Number, default: 0 },
    country: { type: String },
    familyLink: [FamilyLinkSchema],
    isActive: { type: Boolean, default: true },
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPatient", UserPatientSchema);
