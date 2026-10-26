import mongoose from "mongoose";

import app from "./app.js";
import { config } from "./config.js";

const start = async () => {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is required. Copy .env.example to .env and configure it.");
  }

  if (config.isProduction && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in production.");
  }

  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  const server = app.listen(config.port, () => {
    console.log(`BookStore API listening on http://localhost:${config.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received; shutting down gracefully`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start().catch((error) => {
  console.error("Unable to start the API:", error.message);
  process.exit(1);
});
