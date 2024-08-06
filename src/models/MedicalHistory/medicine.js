const mongoose = require("mongoose")
const { Schema } = mongoose;

const FormOfMedicationSchema = new Schema({
    formOfMedicine: {
        type: String,
        required: true
    },
    medicineStrength: {
        type: String
    },
    ingestionMethod:{
        type: String
    },
})

const DosesSchema = new Schema({
   amount: {
       type: Number,
       required: true
   },
   frequency: {
       type: String
   },
   when: {
       type: String
   },
   otherInstructions: {
       type: String
   }
})

const DurationSchema = new Schema({
    whenItBegins: {
        type : Date,
        required: true
    },
    whenItEnds: {
        type : Date
    },
    longDuration: {
        type: Boolean
    }
})

const AdditionalInformationSchema = new Schema({
    medicineTakenFor: {
        type: String,
        required: true
    },
    prescribedBy: {
        type: mongoose.Schema.Types.ObjectId, // Check If the doctor data not into the database
        ref: "UserDoctor"
    },
    sideEffects: {
        type: String
    }
})

export const MedicineSchema = new Schema({
    medicineName: {
        type: String,
        required: true
    },
    formOfMedication: {
        type: [FormOfMedicationSchema],
        required: true
    },
    doses : {
        type: [DosesSchema],
        required: true
    },    
    duration : {
        type: DurationSchema,
        required: true
    },
    additionalInformation: {
        type: AdditionalInformationSchema,
    },
})