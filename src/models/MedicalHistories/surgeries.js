const mongoose = require("mongoose");
const { Schema } = mongoose;

const SurgeriesSchema = new Schema({
  surgeryName: {
    type: String,
    required: true,
  },
  supportDevices: {
    type: String,
    required: false,
  },
  dateOfSurgery: {
    type: Date,
    required: false,
  },
  physicianInCharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDoctor",
    required: false,
  },
  additionalNotes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("surgeries", SurgeriesSchema);
