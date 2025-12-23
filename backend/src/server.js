import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { releaseExpiredLocks } from "./services/seatLock.service.js";
import { env } from "./config/env.js";
const PORT = process.env.PORT || 5000;

connectDB();
setInterval(() => {
  releaseExpiredLocks();
}, 60 * 1000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (env.CLIENT_URL) console.log(`Client URL (CLIENT_URL) = ${env.CLIENT_URL}`);
});



