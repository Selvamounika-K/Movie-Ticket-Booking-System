import express from "express";
import {
  addShow,
  getShowsByMovie,
  getShowById
} from "../controllers/show.controller.js";

const router = express.Router();

// POST /api/shows
router.post("/", addShow); // (admin protected via gateway / future middleware)

// GET /api/shows?movieId=&cityId=
router.get("/", getShowsByMovie);

// GET /api/shows/:showId
router.get("/:showId", getShowById);

export default router;
