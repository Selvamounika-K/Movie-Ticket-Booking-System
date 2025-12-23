import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import cityRoutes from "./routes/city.routes.js";
import theatreRoutes from "./routes/theatre.routes.js";
import showRoutes from "./routes/show.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import screenRoutes from "./routes/screen.routes.js";
import seatRoutes from "./routes/seat.routes.js";
import seatLockRoutes from "./routes/seatLock.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";


const app = express();

const allowedOrigins = [
	env.CLIENT_URL,
	"http://localhost:5173",
	"http://localhost:3000",
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) return callback(null, true);
			return callback(new Error("CORS policy does not allow access from the specified Origin."), false);
		},
		credentials: true,
	})
);

app.use(express.json());

app.use("/api/seat-locks", seatLockRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/seats", seatRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use(errorHandler);
export default app;
