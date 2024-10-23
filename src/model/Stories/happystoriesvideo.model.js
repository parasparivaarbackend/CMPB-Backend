import mongoose from 'mongoose'

const HappyStoriesVideoSchema = new mongoose.Schema({
    Content: {
        type: String,
        required: true,
        trim: true
    },
    VideoUrl: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

}, { timestamps: true })


export const happystoriesvideos = mongoose.model("happystoriesvideos", HappyStoriesVideoSchema)