import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true
    },
    seatNumber: {
      type: String,
      required: true
    },
    seatType: {
      type: String,
      enum: ["REGULAR", "PREMIUM", "VIP"],
      default: "REGULAR"
    },
    row: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Seat = mongoose.model("Seat", seatSchema);
export default Seat;
