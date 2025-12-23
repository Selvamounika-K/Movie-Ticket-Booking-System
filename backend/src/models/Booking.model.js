import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat"
      }
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING"
    },
    qrCode: String
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
