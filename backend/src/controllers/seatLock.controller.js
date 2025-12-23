import SeatLock from "../models/SeatLock.model.js";
import ShowSeat from "../models/ShowSeat.model.js";

const LOCK_DURATION_MINUTES = 5;

/**
 * LOCK SEATS
 */
export const lockSeatsController = async (req, res) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user.id;

    if (!showId || !seatIds || !seatIds.length) {
      return res.status(400).json({ message: "Show and seats required" });
    }

    const now = new Date();
    const expiresAt = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);

    // attempt to atomically lock each seat: only if it's AVAILABLE or previously LOCKED but expired
    const expiryThreshold = new Date(Date.now() - LOCK_DURATION_MINUTES * 60 * 1000);

    const lockedSeats = [];

    for (const seatId of seatIds) {
      const showSeat = await ShowSeat.findOneAndUpdate(
        {
          show: showId,
          seat: seatId,
          $or: [
            { status: "AVAILABLE" },
            { status: "LOCKED", lockedAt: { $lt: expiryThreshold } }
          ]
        },
        {
          $set: {
            status: "LOCKED",
            lockedBy: userId,
            lockedAt: now
          }
        },
        { new: true }
      );

      if (!showSeat) {
        // rollback any seats we already locked in this request
        if (lockedSeats.length) {
          await ShowSeat.updateMany(
            { show: showId, seat: { $in: lockedSeats } },
            { status: "AVAILABLE", lockedAt: null, lockedBy: null }
          );
          await SeatLock.deleteMany({ show: showId, seat: { $in: lockedSeats }, user: userId });
        }

        return res.status(409).json({ message: "One or more seats unavailable" });
      }

      // create SeatLock entry
      await SeatLock.create({ show: showId, seat: seatId, user: userId, expiresAt });
      lockedSeats.push(seatId);
    }

    res.json({ message: "Seats locked successfully 🔒", expiresAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * RELEASE LOCKS (manual or payment failure)
 */
export const releaseSeatLocksController = async (req, res) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user.id;

    await SeatLock.deleteMany({
      show: showId,
      seat: { $in: seatIds },
      user: userId
    });

    await ShowSeat.updateMany(
      { show: showId, seat: { $in: seatIds } },
      {
        status: "AVAILABLE",
        lockedBy: null,
        lockedAt: null
      }
    );

    res.json({ message: "Seat locks released 🔓" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
