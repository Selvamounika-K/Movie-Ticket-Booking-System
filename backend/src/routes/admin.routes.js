import express from "express";
import { adminDashboard } from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, adminDashboard);

export default router;
