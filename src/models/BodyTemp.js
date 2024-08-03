const mongoose = require("mongoose");

const { Schema } = mongoose;

const BodyTempSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserPatient", required: true },
    data: { type: Number, required: true },
    unit: { type: String, required: true, enum: ["°C", "°F"] }, // Assuming Celsius and Fahrenheit as the units
  },
  { timestamps: true }
);

module.exports = mongoose.model("BodyTemp", BodyTempSchema);
