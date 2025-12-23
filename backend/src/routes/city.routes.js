import express from "express";
import { addCity, getCities } from "../controllers/city.controller.js";

const router = express.Router();

router.post("/", addCity);   // Admin
router.get("/", getCities);  // User

export default router;
