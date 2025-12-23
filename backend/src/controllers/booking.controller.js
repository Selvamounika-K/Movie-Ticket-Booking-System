import Booking from "../models/Booking.model.js";
import ShowSeat from "../models/ShowSeat.model.js";
import SeatLock from "../models/SeatLock.model.js";
import Show from "../models/Show.model.js";

/**
 * CREATE BOOKING (PENDING)
 * POST /api/bookings
 */
export const createBookingController = async (req, res) => {
  try {
    const { showId, seatIds, totalAmount } = req.body;
    const userId = req.user.id;

    if (!showId || !seatIds || !seatIds.length) {
      return res
        .status(400)
        .json({ message: "showId and at least one seatId are required" });
    }

    // Validate: Never allow booking past shows
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const showDate = new Date(show.showDate);
    showDate.setHours(0, 0, 0, 0);
    
    if (showDate < today) {
      return res.status(400).json({ message: "Cannot book shows for past dates" });
    }

    // Validate seats are locked by same user and locks not expired
    const now = new Date();
    const locks = await SeatLock.find({
      show: showId,
      seat: { $in: seatIds },
      user: userId,
      expiresAt: { $gt: now }
    }).select("seat");

    if (!locks || locks.length !== seatIds.length) {
      return res
        .status(400)
        .json({ message: "Seats are not locked or lock expired" });
    }

    // ensure ShowSeat status is LOCKED by user
    const seats = await ShowSeat.find({
      show: showId,
      seat: { $in: seatIds },
      status: "LOCKED",
      lockedBy: userId
    });

    if (seats.length !== seatIds.length) {
      return res
        .status(400)
        .json({ message: "Seats are not properly locked" });
    }

    const booking = await Booking.create({
      user: userId,
      show: showId,
      seats: seatIds,
      totalAmount,
      status: "PENDING"
    });

    res
      .status(201)
      .json({ message: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * (Legacy) CONFIRM BOOKING MANUALLY
 * In normal flow, bookings are confirmed via payment.service
 */
export const confirmBookingController = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("seats");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    for (let seat of booking.seats) {
      const showSeat = await ShowSeat.findOne({
        show: booking.show,
        seat
      });

      if (!showSeat) continue;

      showSeat.status = "BOOKED";
      showSeat.lockedAt = null;
      showSeat.lockedBy = null;
      await showSeat.save();
    }

    booking.status = "CONFIRMED";
    await booking.save();

    res.json({
      message: "Booking confirmed",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET BOOKINGS FOR A USER
 * GET /api/bookings/user/:userId
 */
export const getBookingsByUserController = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: ["movie", "theatre", "screen"]
      })
      .populate("seats")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
