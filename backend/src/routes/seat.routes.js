import express from "express";
import { createSeatController } from "../controllers/seat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

// POST /api/seats
router.post("/", protect, adminOnly, createSeatController);

export default router;
