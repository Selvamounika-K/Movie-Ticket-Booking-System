import express from "express";
import {
  lockSeatsController,
  releaseSeatLocksController
} from "../controllers/seatLock.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/lock", protect, lockSeatsController);
router.post("/release", protect, releaseSeatLocksController);

export default router;
