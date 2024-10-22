import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    trim: true,
    index: true,
  },
  firstName: {
    type: String,
    required: [true, "FirstName is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "lastName is required"],
    trim: true,
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    unique: true,
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
    enum: ["admin", "user"],
    default: "user",
  },
}, { timestamps: true });

UserSchema.pre("save",async function (next){
  if (!this.isModified("password")) return next()
    this.password =await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.comparePassword = async function(password){
  return this.password = bcrypt.compare(password, this.password)
}

export const UserModel = mongoose.model("User", UserSchema);
