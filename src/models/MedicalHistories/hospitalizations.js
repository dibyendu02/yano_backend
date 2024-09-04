const mongoose = require("mongoose");
const { Schema } = mongoose;

const HospitalizationSchema = new Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  reasonOfHospitalization: {
    type: String,
    required: true,
  },
  admissionDate: {
    type: Date,
    required: true,
  },
  dischargeDate: {
    type: Date,
  },
  nameOfAttendingPhysician: {
    type: String,
  },
});

module.exports = mongoose.model("Hospitalization", HospitalizationSchema);
