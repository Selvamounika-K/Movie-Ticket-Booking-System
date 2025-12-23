export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || "RAZORPAY"
};
