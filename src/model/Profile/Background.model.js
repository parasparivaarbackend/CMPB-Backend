import mongoose, {Schema} from "mongoose";


const BackgroundSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    }, 
    Religion:{
        type:String,
        required:true,
        trim:true
    },
    Caste:{
        type:String,
        required:true,
        trim:true
    },
    SubCast:{
        type:String,
        required:true,
        trim:true
    },
    SelfWorth:{
        type:Number,
        required:true,
        trim:true
    },
    FamilyWorth:{
        type:Number,
        required:true,
        trim:true
    },
}, {});

export const BackgroundModel = mongoose.model("backgrounds", BackgroundSchema)