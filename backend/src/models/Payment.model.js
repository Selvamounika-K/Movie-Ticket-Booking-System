import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },
    amount: Number,
    provider: {
      type: String,
      default: "RAZORPAY"
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"]
    },
    transactionId: String
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
