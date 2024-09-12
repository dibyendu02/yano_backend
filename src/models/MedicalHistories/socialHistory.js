const mongoose = require("mongoose");
const { Schema } = mongoose;

const EducationSchema = new Schema({
  field: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
});

const SocialHistorySchema = new Schema({
  occupation: {
    type: String,
    required: false,
  },
  education: {
    type: EducationSchema,
    required: false, // Education is optional
  },
  placeOfBirth: {
    type: String,
    required: false,
  },
  maritalStatus: {
    type: String,
    required: false,
  },
  numberOfChildren: {
    type: Number,
    required: false,
  },
  religion: {
    type: String,
    required: false,
  },
  diet: {
    type: String,
    required: false,
  },
  sexualOrientation: {
    type: String,
    required: false,
  },
  doYouSmoke: {
    type: String,
    required: false,
  },
  doYouConsumeAlcohol: {
    type: String,
    required: false,
  },
  useOfOtherSubstances: {
    type: String,
    required: false,
  },
  doYouExercise: {
    type: String,
    required: false,
  },
  stressFactor: {
    type: String,
    required: false,
  },
  spokenLanguage: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("socialHistory", SocialHistorySchema);
