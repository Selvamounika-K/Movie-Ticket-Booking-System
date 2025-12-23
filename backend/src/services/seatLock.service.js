import ShowSeat from "../models/ShowSeat.model.js";

const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

export const lockSeats = async (showId, seatIds, userId) => {
  const now = new Date();

  for (const seatId of seatIds) {
    const showSeat = await ShowSeat.findOne({
      show: showId,
      seat: seatId
    });

    if (!showSeat) {
      throw new Error("Seat not found");
    }

    if (showSeat.status === "BOOKED") {
      throw new Error("Seat already booked");
    }

    if (
      showSeat.status === "LOCKED" &&
      now - showSeat.lockedAt < LOCK_TIME
    ) {
      throw new Error("Seat already locked");
    }

    // lock seat
    showSeat.status = "LOCKED";
    showSeat.lockedBy = userId;
    showSeat.lockedAt = now;
    await showSeat.save();
  }

  return true;
};
export const releaseExpiredLocks = async () => {
  const expiry = new Date(Date.now() - LOCK_TIME);

  // reset show seats
  await ShowSeat.updateMany(
    {
      status: "LOCKED",
      lockedAt: { $lt: expiry }
    },
    {
      status: "AVAILABLE",
      lockedAt: null,
      lockedBy: null
    }
  );

  // remove expired seat lock documents
  const SeatLock = await import("../models/SeatLock.model.js");
  await SeatLock.default.deleteMany({ expiresAt: { $lt: new Date() } });
};
