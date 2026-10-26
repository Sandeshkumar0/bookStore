import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "development";

export const config = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: Number(process.env.PORT) || 4000,
  // MongoDBURI is kept as a fallback for existing local installations.
  mongoUri: process.env.MONGODB_URI || process.env.MongoDBURI,
  jwtSecret:
    process.env.JWT_SECRET || "bookstore-local-development-secret-change-me",
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
