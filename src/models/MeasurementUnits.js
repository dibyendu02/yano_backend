const mongoose = require("mongoose");

const { Schema } = mongoose;

const MeasurementUnitsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserPatient", required: true },
    temperature: { type: String, enum: ["celsius", "fahrenheit"] },
    weight: { type: String, enum: ["kg", "lb"] },
    height: { type: String, enum: ["cm", "ft"] },
    bloodGlucose: { type: String, enum: ["mmol", "mg"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MeasurementUnits", MeasurementUnitsSchema);
