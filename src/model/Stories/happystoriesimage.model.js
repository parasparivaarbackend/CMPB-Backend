import mongoose from 'mongoose'

const HappyStoriesImageSchema = new mongoose.Schema({
    Content: {
        type: String,
        required:true,
        trim:true
    },
    ImageUrl: {
        type: String,
        required:true,
        trim:true
    },
    name: {
        type: String,
        required:true,
        trim:true
    },
    
}, { timestamps: true })


export const happystoriesimages = mongoose.model("happystoriesimages", HappyStoriesImageSchema)