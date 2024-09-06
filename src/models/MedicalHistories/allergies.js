const mongoose = require("mongoose");
const { Schema } = mongoose;

const AllergiesSchema = new Schema(
  {
    nameOfTheAllergy: {
      type: String,
      required: true,
    },
    triggeredBy: {
      type: String,
      required: true,
    },
    reaction: {
      type: String,
      required: true,
    },
    howOften: {
      type: String,
    },
    dateOfFirstDiagnosis: {
      type: Date,
    },
    medicine: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { _id: true }
);
module.exports = mongoose.model("Allergies", AllergiesSchema);
