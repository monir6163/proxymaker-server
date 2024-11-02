import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { authorize, jwtVerify } from "../middlewares/auth.middleware";
import {
  getAllUsers,
  login,
  logout,
  refreshToken,
} from "./../controllers/auth.controller";

const authRoutes: Router = Router();

authRoutes.get(
  "/admin-get-all-users",
  jwtVerify,
  authorize("admin"),
  errorHandler(getAllUsers)
);

authRoutes.post("/login", errorHandler(login));

authRoutes.post("/refresh-token", errorHandler(refreshToken));

authRoutes.post("/logout", jwtVerify, errorHandler(logout));

export default authRoutes;
