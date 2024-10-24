import mongoose, {Schema} from "mongoose";


const PersonalAttitudeSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    },
    Affection: {
        type: String,
        required: true,
        trim: true
    },
    religionService: [{
        type: String,
        required: true,
        trim: true
    }],
}, {})

export const PersonalAttitudeModel = mongoose.model("personalattitudes", PersonalAttitudeSchema)