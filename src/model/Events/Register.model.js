import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);
export const RegisterModel = mongoose.model("registers", RegisterSchema);
