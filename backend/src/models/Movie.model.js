import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    language: { type: String },
    genre: [{ type: String }],
    duration: Number,
    rating: Number,
    posterUrl: String,
    description: String
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
