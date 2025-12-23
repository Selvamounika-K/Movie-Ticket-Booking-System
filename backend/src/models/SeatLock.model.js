import mongoose from "mongoose";

const seatLockSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show"
    },
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    expiresAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("SeatLock", seatLockSchema);
