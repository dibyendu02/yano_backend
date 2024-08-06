const mongoose = require("mongoose");
const { Schema } = mongoose;

export const AllergiesSchema = new Schema({
    nameOfTheAllergy: {
        type: String,
        required: true
    },    
    triggeredBy : {
        type: String,
        required: true
    },
    reaction:{
        type: String,
        required: true
    },
    howOftenDoesItOccur: {
        type: String,
        required: true
    },
    dateOfFirstDiagnosis: {
        type: Date,
    },
    medicine: {
        type: String
    }
})