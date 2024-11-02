import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { prisma } from "..";
import { tokenHelper } from "../../libs/tokenHelper";
import { BadRequest } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";
import { loginSchema } from "../schema/user";
import { secretsKey } from "../secrets";
import { comparePassword } from "./../../libs/hashPassword";

export const getAllUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ status: "success", data: users });
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    loginSchema.parse(req.body);
    const { email, password } = req.body;
    const user = (await prisma.user.findUnique({ where: { email } })) as any;
    if (!user) {
      throw new BadRequest("Invalid credentials", ErrorCode.invalid);
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new BadRequest("Invalid credentials", ErrorCode.invalid);
    }
    // generate access token and refresh token
    const accessToken = tokenHelper.generateAccessToken(user.id);
    const refreshToken = tokenHelper.generateRefreshToken(user.id);
    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
      })
      .json({
        status: "success",
        message: "Login successful",
      });
  }
);

export const refreshToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new BadRequest("Invalid request", ErrorCode.invalid);
    }
    const decodedToken = tokenHelper.verifyToken(
      refreshToken,
      secretsKey.refreshTokenSecret
    );
    if (typeof decodedToken === "object" && "userId" in decodedToken) {
      const user = await prisma.user.findUnique({
        where: { id: Number((decodedToken as { userId: string }).userId) },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          image: true,
        },
      });
      if (!user) {
        throw new BadRequest("Invalid Token", ErrorCode.invalid);
      }
      const accessToken = tokenHelper.generateAccessToken(user.id);
      res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
        })
        .json({
          status: "success",
          message: "Token refreshed",
        });
    } else {
      throw new BadRequest("Invalid Token", ErrorCode.invalid);
    }
  }
);

export const logout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken || !req.cookies.accessToken) {
      throw new BadRequest("Invalid request", ErrorCode.invalid);
    }
    res
      .status(200)
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .json({ status: "success", message: "Logout successful" });
  }
);
