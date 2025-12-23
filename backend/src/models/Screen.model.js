import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Screen 1
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true
  },
  totalSeats: Number
});

export default mongoose.model("Screen", screenSchema);
