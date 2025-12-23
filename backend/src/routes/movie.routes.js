import express from "express";
import { addMovie, getMovies } from "../controllers/movie.controller.js";
import { getShowsByMovie } from "../controllers/show.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

// POST /api/movies
router.post("/", protect, adminOnly, addMovie);

// GET /api/movies
router.get("/", getMovies);

// GET /api/movies/:movieId/shows?cityId=
router.get("/:movieId/shows", getShowsByMovie);

export default router;
