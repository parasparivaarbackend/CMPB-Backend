import mongoose, { Schema } from "mongoose";


const HoobiesAndIntrestSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    }, 
    Hobbies: {
        type:String,
        required:true,
        trim:true
    },
    Intrest: {
        type: String,
        required: true,
        trim: true
    },
    Music: {
        type: String,
        required: true,
        trim: true
    },
    Books: {
        type: String,
        required: true,
        trim: true
    },
    Movies:{
        type: String,
        required: true,
        trim: true
    },
    tvShow: {
        type: String,
        required: true,
        trim: true
    },
    Sports: {
        type: String,
        required: true,
        trim: true
    },
    fitnessActivities: {
        type: String,
        required: true,
        trim: true
    },
    cuisines: {
        type: String,
        required: true,
        trim: true
    },
    dressStyle: {
        type: String,
        required: true,
        trim: true
    }
}, {})


export const HoobiesAndIntrestsModel = mongoose.model("hoobiesandintrests", HoobiesAndIntrestSchema)