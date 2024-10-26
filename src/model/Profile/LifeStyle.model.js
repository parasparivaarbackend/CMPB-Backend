import mongoose, { Schema } from "mongoose";

const LifeStyleSchema = new mongoose.Schema({
  ProfileID: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
  Diet: {
    type: Boolean,
    require: true,
  },
  Drink: {
    type: Boolean,
    require: true,
  },
  Smoke: {
    type: Boolean,
    require: true,
  },
  LivingWith: {
    type: String,
    require: true,
  },
});

export const LifeStyleModel = mongoose.model("lifeStyles", LifeStyleSchema);
