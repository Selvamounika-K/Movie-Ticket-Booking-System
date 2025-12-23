import Seat from "../models/Seat.model.js";

export const createSeatController = async (req, res) => {
  try {
    // Expecting array
    const seats = req.body;

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Seat list required" });
    }

    // Validate each seat
    for (const seat of seats) {
      const { screen, seatNumber, row, price, seatType } = seat;
      if (!screen || !seatNumber || !row || !price) {
        return res
          .status(400)
          .json({ message: "All fields are required for every seat" });
      }
      if (!seatType) {
        return res
          .status(400)
          .json({ message: "seatType is required for every seat" });
      }
    }

    const createdSeats = await Seat.insertMany(seats);

    res.status(201).json({
      message: "Seats created successfully 💺💺",
      count: createdSeats.length,
      seats: createdSeats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
