import mongoose, { Schema } from "mongoose";

const partnerExpectationSchema = new mongoose.Schema({
  ProfileID: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
  GernalRequirement: {
    type: String,
    require: true,
    trim: true,
  },

  ResidenceCountry: {
    type: String,
    require: true,
    trim: true,
  },
  Height: {
    type: Number,
    require: true,
    trim: true,
  },

  weight: {
    type: Number,
    require: true,
    trim: true,
  },
  MaritalStatus: {
    type: String,
    require: true,
    trim: true,
  },
  Children: {
    type: Number,
    require: true,
    trim: true,
  },
  Religion: {
    type: String,
    require: true,
    trim: true,
  },
  Caste: {
    type: String,
    require: true,
    trim: true,
  },
  SubCaste: {
    type: String,
    require: true,
    trim: true,
  },
  Language: {
    type: String,
    require: true,
    trim: true,
  },
  Education: {
    type: String,
    require: true,
    trim: true,
  },
  Profession: {
    type: String,
    require: true,
    trim: true,
  },
  SmokingAcceptable: {
    type: String,
    require: true,
    trim: true,
  },
  DietAcceptable: {
    type: String,
    require: true,
    trim: true,
  },
  DrinkAcceptable: {
    type: String,
    require: true,
    trim: true,
  },
  personalValue: {
    type: Number,
    require: true,
    trim: true,
  },
  Manglik: {
    type: String,
    require: true,
    trim: true,
  },
  PreferredCountry: {
    type: String,
    require: true,
    trim: true,
  },
  PreferredState: {
    type: String,
    require: true,
    trim: true,
  },
  FamilyValue: {
    type: Number,
    require: true,
    trim: true,
  },
  Complexion: {
    type: String,
    require: true,
    trim: true,
  },
});

export const PartnerExpectationModel = mongoose.model(
  "partnerexpectations",
  partnerExpectationSchema
);
