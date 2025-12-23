import express from "express";
import { createScreenController } from "../controllers/screen.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

// POST /api/screens
router.post("/", protect, adminOnly, createScreenController);

export default router;
