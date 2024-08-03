const mongoose = require("mongoose");

const { Schema } = mongoose;

const ECGSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserPatient", required: true },
    data: { type: Array, required: true }, // Assuming data is an array of measurements
    unit: { type: String, required: true, enum: ["mV"] }, // Assuming millivolts as the unit
  },
  { timestamps: true }
);

module.exports = mongoose.model("ECG", ECGSchema);
