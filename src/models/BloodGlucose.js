const mongoose = require("mongoose");

const { Schema } = mongoose;

const BloodGlucoseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserPatient", required: true },
    age: { type: Number, required: true },
    data: { type: Number, required: true },
    unit: { type: String, required: true, enum: ["mg/dL", "mmol/L"] }, // Assuming two common units
    foodConsumed: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodGlucose", BloodGlucoseSchema);
