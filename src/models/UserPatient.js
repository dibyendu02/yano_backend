const mongoose = require("mongoose");
const UserDoctor = require("../models/UserDoctor");

const { Schema } = mongoose;

const DeviceSchema = new Schema({
  deviceName: { type: String, required: true },
  deviceSerialNumber: { type: String, required: true },
  deviceType: { type: String, required: true },
  lastSynced: { type: Date },
});

const UserPatientSchema = new Schema(
  {
    userImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    userType: { type: String, default: "patient" },
    firstName: { type: String, required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "UserDoctor" },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    bloodType: { type: String },
    devices: [DeviceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPatient", UserPatientSchema);
