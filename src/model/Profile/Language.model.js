import mongoose, {Schema} from "mongoose";

const LanguageSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    }, 
    motherTounge: {
        type:String,
        required:true,
        trim:true
    },
    knownLanguage: [{
        type:String,
        required:true,
        trim:true
    }],
}, {});

export const LanguageModel = mongoose.model("languages", LanguageSchema)