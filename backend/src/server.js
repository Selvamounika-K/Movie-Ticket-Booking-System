import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { releaseExpiredLocks } from "./services/seatLock.service.js";
const PORT = process.env.PORT || 5000;

connectDB();
setInterval(() => {
  releaseExpiredLocks();
}, 60 * 1000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



