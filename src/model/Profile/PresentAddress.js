import mongoose, { Schema } from "mongoose";

const PresentAddressSchema = new mongoose.Schema({
  ProfileID: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
  Country: {
    type: String,
    required: true,
    trim: true,
  },
  State: {
    type: String,
    required: true,
    trim: true,
  },
  City: {
    type: String,
    required: true,
    trim: true,
  },
  ResidencyType: {
    type: String,
    enum: ["own", "rented"],
    require: true,
  },
  ResidencySince: {
    type: Number,
    require: true,
  },
  Pincode: {
    type: String,
    required: true,
    trim: true,
  },
});

export const presentaddressmodels = mongoose.model(
  "presentaddressmodels",
  PresentAddressSchema
);
