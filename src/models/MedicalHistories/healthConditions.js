const mongoose = require("mongoose");
const { Schema } = mongoose;

const HealthConditionsSchema = new Schema({
  nameOfTheHealthCondition: {
    type: String,
    required: true,
  },
  dateOfDiagnosis: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  TreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDoctor",
    required: false, // Not all conditions might be treated by a doctor recorded in the system
  },
  medicine: {
    type: String,
    required: false, // Not all health conditions might have a specific medicine associated
  },
  additionalNotes: {
    type: String,
    required: false, // Additional notes should be optional
  },
});
module.exports = HealthConditionsSchema;
