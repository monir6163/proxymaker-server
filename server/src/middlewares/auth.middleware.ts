import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { prisma } from "..";
import { tokenHelper } from "../../libs/tokenHelper";
import { BadRequest } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";
import { secretsKey } from "../secrets";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      image: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}

export const jwtVerify = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.headers?.authorization?.split(" ")[1] ||
        req.body?.refreshToken;
      if (!token) {
        throw new BadRequest("Invalid Token", ErrorCode.invalid);
      }

      const decodedToken = tokenHelper.verifyToken(
        token,
        secretsKey.accessTokenSecret
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
        req.user = user as typeof req.user;
        next();
      } else {
        throw new BadRequest("Invalid Token", ErrorCode.invalid);
      }
    } catch (error) {
      throw new BadRequest("Invalid Token", ErrorCode.invalid);
    }
  }
);

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new BadRequest("Unauthorized", ErrorCode.unauthorized);
    }
    next();
  };
};
