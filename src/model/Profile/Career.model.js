import mongoose, { Schema } from "mongoose";

const CareerSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    },
    designation: {
        type: String,
        required:true,
        trim:true
    },
    company: {
        type: String,
        required:true,
        trim:true
    },
    start: {
        type: String,
        required:true,
        trim:true
    },
    end: {
        type: String,
        required:true,
        trim:true
    },
});




export const careermodel = mongoose.model("careers", CareerSchema);
