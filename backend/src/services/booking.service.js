import Booking from "../models/Booking.model.js";
import ShowSeat from "../models/ShowSeat.model.js";

export const confirmSeats = async (showId, seatIds) => {
  await ShowSeat.updateMany(
    { show: showId, seat: { $in: seatIds } },
    { status: "BOOKED" }
  );
};

export const createBooking = async (data) => {
  return await Booking.create(data);
};
