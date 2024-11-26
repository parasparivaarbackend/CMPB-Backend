import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      URL: {
        type: String,
        required: true,
        trim: true,
      },
      uploadID: {
        type: String,
        required: true,
        trim: true,
      },
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const blogs = mongoose.model("blogs", BlogSchema);
