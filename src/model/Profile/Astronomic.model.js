import mongoose, {Schema} from "mongoose";


const AstronomicSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    },
    SunSign:{
        type:String,
        required:true,
        trim:true
    },
    MoonSign:{
        type:String,
        required:true,
        trim:true
    },
    TimeOfBirth:{
        type:String,
        required:true,
        trim:true
    },
    CityOfBirth:{
        type:String,
        required:true,
        trim:true
    },
}, {});

export const AstronomicModel = mongoose.model("astronomics", AstronomicSchema)