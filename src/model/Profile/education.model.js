import mongoose, { Schema } from "mongoose";

const educationSchema = new mongoose.Schema({
  ProfileID: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
  Degree: {
    type: String,
    require: true,
    trim: true,
  },
  insitution: {
    type: String,
    require: true,
    trim: true,
  },
  start: {
    type: String,
    require: true,
    trim: true,
  },
  end: {
    type: String,
    require: true,
    trim: true,
  },
});

export const EducationModel = mongoose.model("educations", educationSchema);
