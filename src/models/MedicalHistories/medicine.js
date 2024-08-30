const mongoose = require("mongoose");
const { Schema } = mongoose;

const FormOfMedicationSchema = new Schema({
  formOfMedicine: {
    type: String,
    required: true,
  },
  medicineStrength: {
    type: String,
    required: false,
  },
  medicineStrengthUnit: {
    type: String,
    required: false,
  },
  ingestionMethod: {
    type: String,
    required: false,
  },
});

const DosesSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  frequency: {
    type: String,
    required: false,
  },
  when: {
    type: String,
    required: false,
  },
  otherInstructions: {
    type: String,
    required: false,
  },
});

const DurationSchema = new Schema({
  whenItBegins: {
    type: Date,
    required: true,
  },
  whenItEnds: {
    type: Date,
    required: false,
  },
  longDuration: {
    type: Boolean,
    required: false,
  },
});

const AdditionalInformationSchema = new Schema({
  medicineTakenFor: {
    type: String,
    required: true,
  },
  prescribedBy: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "UserDoctor",
    type: String,
    required: false,
  },
  sideEffects: {
    type: String,
    required: false,
  },
});

const MedicineSchema = new Schema({
  medicineName: {
    type: String,
    required: true,
  },
  formOfMedication: {
    type: FormOfMedicationSchema,
    required: true,
  },
  doses: {
    type: DosesSchema,
    required: true,
  },
  duration: {
    type: DurationSchema,
    required: true,
  },
  additionalInformation: {
    type: AdditionalInformationSchema,
    required: false,
  },
});
module.exports = mongoose.model("medicine", MedicineSchema);
