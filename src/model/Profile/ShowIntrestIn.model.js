import mongoose, { Schema } from "mongoose";

const ShowIntrestInSchema = new mongoose.Schema(
  {
    ProfileID: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
    },
    IntrestedIn: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

export const ShowIntrestInModel = mongoose.model("showintrestins", ShowIntrestInSchema);