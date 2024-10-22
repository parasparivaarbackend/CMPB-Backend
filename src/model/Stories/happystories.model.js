import mongoose, {Schema} from 'mongoose'

const HappyStoriesSchema = new mongoose.Schema({
    images:[ {
        type: Schema.Types.ObjectId,
        ref:"happystoriesimage"
    }],
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "happystoriesvideo"
    }],
}, { timestamps: true })


export const happystories = mongoose.model("happystories", HappyStoriesSchema)