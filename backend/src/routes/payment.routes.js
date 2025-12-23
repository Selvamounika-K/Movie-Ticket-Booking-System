import express from "express";
import { paymentSuccess } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Main endpoint as per spec: POST /api/payments
router.post("/", protect, paymentSuccess);

// Backwards-compatible alias: POST /api/payments/success
router.post("/success", protect, paymentSuccess);

export default router;
