import mongoose from 'mongoose'

const programeBookingSchema = new mongoose.Schema({
    Date: {
        type: String,
        required: true,
        trim: true
    },
    paid: {
        type: Boolean,
        required: true,
        trim: true
    },
}, { timestamps: true })


export const programebookings = mongoose.model("programebookings", programeBookingSchema)