import mongoose from "mongoose";

const ChurayeHuaPalSchema = new mongoose.Schema({
    VideoURL:{
        type:String,
        required:true,
        trim:true
    }
}, {timestamps:true});

export const ChurayeHuaPalModel = mongoose.model("churayehuapals", ChurayeHuaPalSchema)