import mongoose, { Schema } from "mongoose";

const eventPaymentSchema = new mongoose.Schema(
  {
    eventID: {
      type: Schema.Types.ObjectId,
      ref: "eventdetails",
    },
    ClientDetails: [
      {
        UserID: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        razorpayOrderID: {
          type: String,
          trim: true,
          require: true,
          unique: true,
        },
        RazorPayPaymentId: {
          type: String,
          trim: true,
          require: true,
          unique: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const eventPaymentModel = mongoose.model(
  "eventpayments",
  eventPaymentSchema
);
