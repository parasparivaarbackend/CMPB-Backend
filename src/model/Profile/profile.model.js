import mongoose, { Schema } from "mongoose";

const ProfileSchema = new mongoose.Schema({
  UserID: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  profileImage: {
    type: String,
    trim: true,
  },
  PresentAddress: {
    type: Schema.Types.ObjectId,
    ref: "presentaddressmodels",
  },
  education: [
    {
      type: Schema.Types.ObjectId,
      ref: "educations",
    },
  ],
});

export const ProfileModel = mongoose.model("profiles", ProfileSchema);
