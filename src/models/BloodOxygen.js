const mongoose = require("mongoose");

const { Schema } = mongoose;

const BloodOxygenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserPatient", required: true },
    data: { type: Number, required: true },
    unit: { type: String, required: true, enum: ["%"] }, // Assuming percentage as the unit
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodOxygen", BloodOxygenSchema);
