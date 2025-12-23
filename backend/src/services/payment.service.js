import Payment from "../models/Payment.model.js";
import Booking from "../models/Booking.model.js";
import ShowSeat from "../models/ShowSeat.model.js";
import SeatLock from "../models/SeatLock.model.js";

export const recordPayment = async (data) => {
  // Note: Removed MongoDB transactions to support standalone MongoDB instances
  // Seat locking mechanism already prevents double-booking

  const payment = await Payment.create(data);

  const booking = await Booking.findById(data.booking);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "PENDING") throw new Error("Booking not pending");

  // attempt to mark all seats BOOKED only if they are LOCKED by the same user
  const resUpdate = await ShowSeat.updateMany(
    {
      show: booking.show,
      seat: { $in: booking.seats },
      status: "LOCKED",
      lockedBy: booking.user
    },
    { status: "BOOKED", lockedAt: null, lockedBy: null }
  );

  // ensure all seats were updated
  if (resUpdate.matchedCount !== booking.seats.length) {
    // not all seats could be confirmed
    // cancel booking
    booking.status = "CANCELLED";
    await booking.save();
    throw new Error("One or more seats were unavailable during payment");
  }

  // delete seat lock documents
  await SeatLock.deleteMany({ show: booking.show, seat: { $in: booking.seats } });

  booking.status = "CONFIRMED";
  await booking.save();

  return payment;
};
