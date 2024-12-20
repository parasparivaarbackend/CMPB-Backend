import mongoose, { Schema } from "mongoose";

const ProfileSchema = new mongoose.Schema({
  UserID: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  PresentAddress: {
    type: Schema.Types.ObjectId,
    ref: "presentaddressmodels",
  },

  education: {
    type: Schema.Types.ObjectId,
    ref: "educations",
  },
  careers: {
    type: Schema.Types.ObjectId,
    ref: "careers",
  },
  physicalattributes: {
    type: Schema.Types.ObjectId,
    ref: "physicalattributes",
  },
  languages: {
    type: Schema.Types.ObjectId,
    ref: "languages",
  },
  hoobiesandintrests: {
    type: Schema.Types.ObjectId,
    ref: "hoobiesandintrests",
  },
  personalattitudes: {
    type: Schema.Types.ObjectId,
    ref: "personalattitudes",
  },
  residencyinfos: {
    type: Schema.Types.ObjectId,
    ref: "residencyinfos",
  },
  backgrounds: {
    type: Schema.Types.ObjectId,
    ref: "backgrounds",
  },
  lifestyles: {
    type: Schema.Types.ObjectId,
    ref: "lifestyles",
  },
  astronomics: {
    type: Schema.Types.ObjectId,
    ref: "astronomics",
  },
  permanentaddress: {
    type: Schema.Types.ObjectId,
    ref: "permanentaddress",
  },
  familyinfos: {
    type: Schema.Types.ObjectId,
    ref: "familyinfos",
  },
  partnerexpectations: {
    type: Schema.Types.ObjectId,
    ref: "partnerexpectations",
  },
  showintrestins: {
    type: Schema.Types.ObjectId,
    ref: "showintrestins",
  },
});

export const ProfileModel = mongoose.model("profiles", ProfileSchema);
