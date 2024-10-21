import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["Admin", "User"],
    default: "User",
  },
});

export const UserModel = mongoose.model("User", UserSchema);
