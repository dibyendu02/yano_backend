const mongoose = require("mongoose");
const HealthConditionsSchema = require("./MedicalHistory/healthConditions");
const { FamilyHistorySchema } = require("./MedicalHistory/familyHistory");
const { AllergiesSchema } = require("./MedicalHistory/allergies");
const { MedicineSchema } = require("./MedicalHistory/medicine");
const { SurgeriesSchema } = require("./MedicalHistory/surgeries");
const { VaccineSchema } = require("./MedicalHistory/vaccine");
const { HospitalizationSchema } = require("./MedicalHistory/hospitalizations");
const { SocialHistorySchema } = require("./MedicalHistory/socialHistory");
const { Schema } = mongoose;

const MedicalHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserPatient",
      required: true,
    },
    healthConditions: {
      type: [HealthConditionsSchema],
      required: false,
    },
    familyHistory: {
      type: [FamilyHistorySchema],
      required: false,
    },
    allergies: {
      type: [AllergiesSchema],
      required: false,
    },
    medicines: {
      type: [MedicineSchema],
      required: false,
    },
    surgeries: {
      type: [SurgeriesSchema],
      required: false,
    },
    vaccines: {
      type: [VaccineSchema],
      required: false,
    },
    hospitalizations: {
      type: [HospitalizationSchema],
      required: false,
    },
    socialHistory: {
      type: [SocialHistorySchema],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalHistory", MedicalHistorySchema); // Exporting the model
