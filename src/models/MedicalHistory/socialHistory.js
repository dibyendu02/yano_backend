const mongoose = require("mongoose");
const { Schema } = mongoose;

const EducationSchema = new Schema({
    field:{
        type: String,
        required: true
    },
    date : {
        type: Date
    }
})

export const SocialHistorySchema = new Schema({
    occupation: {
        type: String,
        required: true
    },
    education: {
        type: EducationSchema,   
    },
    placeOfBirth: {
        type: String
    },
    maritalStatus: {
        type: String
    },
    numberOfChildren: {
        type: Number
    },
    religion: {
        type: String
    },
    diet: {
        type: String
    },
    sexualOrientation: {
        type: String
    },
    doYouSmoke: {
        type: Boolean
    },
    doYouConsumeAlcohol: {
        type: Boolean
    },
    useOfOtherSubstances: {
        type: String
    },
    doYouExercise: {
        type: String
    },
    stressFactor: {
        type: String
    },
    spokenLanguage: {
        type: String
    }
})