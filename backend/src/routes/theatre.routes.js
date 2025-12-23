import express from "express";
import {
  addTheatre,
  getTheatresByCity
} from "../controllers/theatre.controller.js";

const router = express.Router();

router.post("/", addTheatre);                 // Admin
router.get("/city/:cityId", getTheatresByCity); // User

export default router;
