import express from "express";
import {
  createBookingController,
  confirmBookingController,
  getBookingsByUserController
} from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/bookings
router.post("/", protect, createBookingController);

// POST /api/bookings/confirm (optional manual flow)
router.post("/confirm", protect, confirmBookingController);

// GET /api/bookings/user/:userId
router.get("/user/:userId", protect, getBookingsByUserController);

export default router;
