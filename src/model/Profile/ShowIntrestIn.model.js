import mongoose, { Schema } from "mongoose";

const ShowIntrestInSchema = new mongoose.Schema({
    ClientID:
    {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    IntrestedIn: 
        [{
        type: Schema.Types.ObjectId,
        ref: "user",
    }]

}, {timestamps:true});

export const ShowIntrestInModel = mongoose.model("showintrestins", ShowIntrestInSchema);