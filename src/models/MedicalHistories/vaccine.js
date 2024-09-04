const mongoose = require("mongoose");
const { Schema } = mongoose;

const VaccineSchema = new Schema({
  vaccineFor: {
    type: String,
    required: true,
  },
  shotDate: {
    type: Date,
    required: true,
  },
  vaccineName: {
    type: String,
    required: false,
  },
  vaccineDetails: {
    type: String,
    required: false,
  },
  lotNumber: {
    type: String,
    required: false,
  },
  additionalNotes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("vaccine", VaccineSchema);
