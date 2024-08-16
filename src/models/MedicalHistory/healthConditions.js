const mongoose = require("mongoose");

const { Schema } = mongoose;

export const HealthConditionsSchema = new Schema({
    nameOfTheHealthCondition:{
        type: String,
        required: true        
    },
    dateOfDiagnosis: {
        type: Date,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    TreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDoctor"
    },
    medicine : {
        type: String
    },
    additionalNotes : {
        type: String
    }
})

