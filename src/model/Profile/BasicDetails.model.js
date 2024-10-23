import mongoose, { Schema } from "mongoose";

const BasicDetailsSchema = new mongoose.Schema({
  ProfileID: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },

  maritalStatus: {
    type: String,
    required: true,
    enum: {
      values: ["Single", "Divorced", "Widowed"],
      message: "Marital status must be either Single, Divorced or Widow.",
    },
  },
  children: {
    type: Number,
  },
  
});

export const BasicDetailsModel = mongoose.model(
  "basicdetails",
  BasicDetailsSchema
);
