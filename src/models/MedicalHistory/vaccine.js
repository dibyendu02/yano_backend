const mongoose = require("mongoose");
const { Schema } = mongoose;

export const VaccineSchema = new Schema({
    vaccineFor: {
        type: String,
        required: true
    },
    shootingDate: {
        type: Date,
        required: true
    },
    vaccineName: {
        type: String,
        required: true
    },
    vaccineDetails: {
        type: String
    },
    lotNumber: {
        type: String
    },
    additionalNotes: {
        type: String
    }
})