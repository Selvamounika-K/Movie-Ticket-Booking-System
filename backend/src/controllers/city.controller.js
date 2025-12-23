import City from "../models/City.model.js";

// ADD CITY
export const addCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL CITIES
export const getCities = async (req, res) => {
  const cities = await City.find();
  res.json(cities);
};
