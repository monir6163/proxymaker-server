import * as jwt from "jsonwebtoken";
import { secretsKey } from "../src/secrets";

export const tokenHelper = {
  generateAccessToken: (userId: number): string => {
    return jwt.sign({ userId }, secretsKey.accessTokenSecret, {
      expiresIn: secretsKey.accessTokenExpiry,
    });
  },
  generateRefreshToken: (userId: number): string => {
    return jwt.sign({ userId }, secretsKey.refreshTokenSecret, {
      expiresIn: secretsKey.refreshTokenExpiry,
    });
  },
  verifyToken: (token: string, secret: string): string | object => {
    return jwt.verify(token, secret);
  },
};
