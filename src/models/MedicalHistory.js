const mongoose = require("mongoose");
const {
  HealthConditionsSchema,
} = require("./MedicalHistories/healthConditions");
const { FamilyHistorySchema } = require("./MedicalHistories/familyHistory");
const { AllergiesSchema } = require("./MedicalHistories/allergies");
const { MedicineSchema } = require("./MedicalHistories/medicine");
const { SurgeriesSchema } = require("./MedicalHistories/surgeries");
const { VaccineSchema } = require("./MedicalHistories/vaccine");
const {
  HospitalizationSchema,
} = require("./MedicalHistories/hospitalizations");
const { SocialHistorySchema } = require("./MedicalHistories/socialHistory");
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
