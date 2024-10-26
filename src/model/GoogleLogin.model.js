import mongoose, { Schema } from "mongoose";

const GoogleSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    trim: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["admin", "user"],
    default: "user",
  },
  active: {
    type: Boolean,
    require: true,
    default: false,
  },
  RegisterPackage: {
    type: Boolean,
    require: true,
    default: false,
  },
  ProfileID: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
});

export const GoogleModel = mongoose.model("googleusers", GoogleSchema);
