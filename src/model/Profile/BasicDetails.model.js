import mongoose, { Schema } from "mongoose";

const BasicDetailsSchema = new mongoose.Schema({
  ProfileID: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
  firstName: {
    type: String,
    required: [true, "First name is required."],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required."],
    trim: true,
  },
  gender: {
    type: String,
    required: [true, "Gender is required."],

    enum: {
      values: ["male", "female"],
      message: "Gender must be either male or female.",
    },
  },
  DOB: {
    type: String,
    require: [true, "Date of Birth is required."],
    trim: true,
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
  profileImage: {
    type: String,
    trim: true,
  },
});

export const BasicDetailsModel = mongoose.model(
  "basicdetails",
  BasicDetailsSchema
);
