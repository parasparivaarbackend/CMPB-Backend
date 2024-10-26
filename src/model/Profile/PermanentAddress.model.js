import mongoose, {Schema} from "mongoose";

const PermanentAddressSchema = new mongoose.Schema({
    ProfileID: {
        type: Schema.Types.ObjectId,
        ref: "profiles",
    }, 
    Country: {
        type:String,
        required:true,
        trim:true
    },
    State: {
        type:String,
        required:true,
        trim:true
    },
    City: {
        type:String,
        required:true,
        trim:true
    },
    Pincode:{
        type:String,
        required:true,
        trim:true
    } 
}, {});

export const PermanentAddressModel = mongoose.model("permanentaddress", PermanentAddressSchema)
