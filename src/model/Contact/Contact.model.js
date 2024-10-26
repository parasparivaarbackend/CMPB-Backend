import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    name:  {
        type:String,
        required:true,
        trim:true
    },
    email:  {
        type:String,
        required:true,
        trim:true
    },
    phone:  {
        type:String,
        required:true,
        trim:true
    },
    message: {
        type:String,
        required:true,
        trim:true
    }  
}, {timestamps:true});

export const ConatctModel = mongoose.model("contact", ContactSchema)