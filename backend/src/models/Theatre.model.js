import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  }
});

export default mongoose.model("Theatre", theatreSchema);
