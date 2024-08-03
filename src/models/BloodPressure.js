const mongoose = require("mongoose");

const { Schema } = mongoose;

const BloodPressureSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserPatient", required: true },
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
    unit: { type: String, required: true, enum: ["mmHg"] }, // Assuming mmHg as the unit
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodPressure", BloodPressureSchema);
