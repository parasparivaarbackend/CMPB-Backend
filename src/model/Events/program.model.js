import mongoose, {Schema} from 'mongoose'

const programeSchema = new mongoose.Schema({
    eventDetails:[{
        type: Schema.Types.ObjectId,
        ref: "eventdetails"
    }]
}, {timestamps:true})


export const programes = mongoose.model("programes", programeSchema)