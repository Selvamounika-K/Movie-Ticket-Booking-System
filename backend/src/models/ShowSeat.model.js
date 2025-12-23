import mongoose from "mongoose";

const showSeatSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true
  },
  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "LOCKED", "BOOKED"],
    default: "AVAILABLE"
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  lockedAt: {
    type: Date
  }
});

const ShowSeat = mongoose.model("ShowSeat", showSeatSchema);
export default ShowSeat;
