const mongoose = require("mongoose");

const { Schema } = mongoose;

export const FamilyHistorySchema = new Schema({
    relationShip : {
        type: String,
        required: true
    },
    healthCondition: {
        type: String
    }
})