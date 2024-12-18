import mongoose, { Schema } from "mongoose";

const PhysicalAttributeSchema = new mongoose.Schema(
  {
    ProfileID: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
    },
    Height: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: String,
      required: true,
      trim: true,
    },
    skinComplexion: {
      type: String,
      required: true,
      trim: true,
    },
    BloodGroup: {
      type: String,
      required: true,
      trim: true,
    },
    Disablity: {
      type: String,
      required: true,
      trim: true,
    },
    DisablityType: {
      type: String,
      trim: true,
    },
  },
  {}
);

export const PhysicalAttributeModel = mongoose.model(
  "physicalattributes",
  PhysicalAttributeSchema
);
