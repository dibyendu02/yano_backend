const mongoose = require("mongoose");

const { Schema } = mongoose;

const FamilyHistorySchema = new Schema({
  relationShip: {
    type: String,
    required: true,
  },
  healthCondition: {
    type: String,
  },
});
module.exports = mongoose.model("FamilyHistory", FamilyHistorySchema);
