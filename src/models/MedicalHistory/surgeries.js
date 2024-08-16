const mongoose = require("mongoose");
const { Schema } = mongoose;

export const SurgeriesSchema = new Schema({
    surgeryName: {
        type: String,
        required: true
    },
    supportDevices: {
        type: String
    },
    dateOfSurgery: {
        type: Date
    },
    physicianInCharge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDoctor"
    },
    additionalNotes: {
        type: String
    }
})