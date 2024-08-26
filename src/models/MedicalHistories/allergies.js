const mongoose = require("mongoose");
const { Schema } = mongoose;

const AllergiesSchema = new Schema(
  {
    nameOfTheAllergy: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    moreDetails: {
      type: String,
      required: true,
    },
    treatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDoctor",
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
