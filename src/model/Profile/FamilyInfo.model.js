import mongoose, { Schema } from "mongoose";

const FamilyInfoSchema = new mongoose.Schema(
  {
    ProfileID: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
    },
    Father: {
      type: String,
      required: true,
      trim: true,
    },
    Mother: {
      type: String,
      required: true,
      trim: true,
    },
    siblings: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {}
);

export const FamilyInfoModel = mongoose.model("familyinfos", FamilyInfoSchema);
