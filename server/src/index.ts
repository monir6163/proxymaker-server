import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware";
import rootRoutes from "./routes";
import { secretsKey } from "./secrets";

const app: Express = express();
//middlewares setup
app.use(
  cors({
    origin: secretsKey.corsOrigin,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());
app.use(morgan(secretsKey.morganLogging));

//routes setup
app.use("/api", rootRoutes);

//prisma setup
export const prisma = new PrismaClient({
  log: ["query"],
});

//error handling middleware
app.use(errorMiddleware);

app.listen(secretsKey.port, () => {
  console.log(`Server is running on http://localhost:${secretsKey.port}`);
});
