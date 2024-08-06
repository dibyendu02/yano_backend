const mongoose = require("mongoose");
const { HealthConditionsSchema } = require("./MedicalHistory/healthConditions");
const { FamilyHistorySchema } = require("./MedicalHistory/familyHistory");
const { AllergiesSchema } = require("./MedicalHistory/allergies");
const { MedicineSchema } = require("./MedicalHistory/medicine");
const { SurgeriesSchema } = require("./MedicalHistory/surgeries");
const { VaccineSchema } = require("./MedicalHistory/vaccine");
const { HospitalizationSchema } = require("./MedicalHistory/hospitalizations");
const { SocialHistorySchema } = require("./MedicalHistory/socialHistory");
const { Schema } = mongoose;

const MedicalHistorySchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: "UserPatient",
        required: true
    },
    healthConditions : [HealthConditionsSchema],
    familyHistory : [FamilyHistorySchema],
    allergies : [AllergiesSchema],
    medicines: [MedicineSchema],
    surgeries: [SurgeriesSchema],
    vaccines: [VaccineSchema],
    hospitalizations: [HospitalizationSchema],
    socialHistory: [SocialHistorySchema]

}, { timestamps: true });

module.exports = mongoose.model("MedicalHistory", MedicalHistorySchema)