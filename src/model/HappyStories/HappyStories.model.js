import mongoose from "mongoose";


const HappyStoriesSchema = new mongoose.Schema({
    Groom: {
        type:String,
        required:true,
        trim:true
    },
    Bride: {
        type:String,
        required:true,
        trim:true
    },
    Content: {
        type:String,
        required:true,
        trim:true
    },
    story: {
        ImageID:{
            type: String,
        },
        ImageURL:{
            type: String,
        },
    }
    
}, {timestamps:true});

export const happystoriesmodel = mongoose.model("happystories", HappyStoriesSchema)