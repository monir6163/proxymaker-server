import dotenv from "dotenv";
dotenv.config({ path: ".env" });
export const secretsKey = {
  port: process.env.PORT || 8000,
  corsOrigin: process.env.CORS_ORIGIN,
  morganLogging: process.env.MORGAN_LOGGING || "dev",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};
