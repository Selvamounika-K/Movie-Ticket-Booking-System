import Screen from "../models/Screen.model.js";

export const createScreenController = async (req, res) => {
  try {
    const { name, theatre, totalSeats } = req.body;

    if (!name || !theatre || !totalSeats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const screen = await Screen.create({
      name,
      theatre,
      totalSeats
    });

    res.status(201).json({
      message: "Screen created successfully 🎬",
      screen
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
