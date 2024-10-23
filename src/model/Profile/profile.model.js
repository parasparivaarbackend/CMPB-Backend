import mongoose, { Schema } from "mongoose";

const ProfileSchema = new mongoose.Schema({
  UserID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  BasicDetails: {
    type: Schema.Types.ObjectId,
    ref: "basicdetails",
  },
});

export const ProfileModel = mongoose.model("profiles", ProfileSchema);
