import mongoose,{Schema} from "mongoose";


const residencyInfoSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    }, 
    birthCounty: {
        type: String,
        require: true,
        trim: true
    },
    residencyCounty: {
        type: String,
        require: true,
        trim: true
    },
    grownUpCountry: {
        type: String,
        require: true,
        trim: true
    },
    ImmigrationStatus: {
        type: String,
        require: true,
        trim: true
    }

})


export const residencyInfosModal = mongoose.model("residencyinfos", residencyInfoSchema);