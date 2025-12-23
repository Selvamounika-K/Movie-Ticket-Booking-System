import Theatre from "../models/Theatre.model.js";

// ADD THEATRE
export const addTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json(theatre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET THEATRES BY CITY
export const getTheatresByCity = async (req, res) => {
  const { cityId } = req.params;

  const theatres = await Theatre.find({ city: cityId })
    .populate("city");

  res.json(theatres);
};
