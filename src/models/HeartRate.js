const mongoose = require("mongoose");

const { Schema } = mongoose;

const HeartRateSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserPatient", required: true },
    data: { type: Number, required: true },
    unit: { type: String, required: true, enum: ["bpm"] }, // Assuming beats per minute as the unit
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeartRate", HeartRateSchema);
