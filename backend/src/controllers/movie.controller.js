import Movie from "../models/Movie.model.js";

export const addMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json(movie);
};

export const getMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};
