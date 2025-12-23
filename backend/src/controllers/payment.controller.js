import { recordPayment } from "../services/payment.service.js";

export const paymentSuccess = async (req, res) => {
  try {
    const { bookingId, amount, transactionId } = req.body;

    const payment = await recordPayment({ booking: bookingId, amount, status: "SUCCESS", transactionId });

    res.json({ message: "Payment successful", payment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
