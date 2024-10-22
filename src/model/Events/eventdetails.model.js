import mongoose from 'mongoose'

const eventDetailsSchema = new mongoose.Schema({
    availableDates: {
        type: String,
        required: true,
        trim: true
    },
    venues: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    eventName: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true })


export const eventdetails = mongoose.model("eventdetails", eventDetailsSchema)