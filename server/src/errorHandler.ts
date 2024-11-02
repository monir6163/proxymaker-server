import { NextFunction, Request, Response } from "express";
import { InternalException } from "./exceptions/internalException";
import { ErrorCode, HttpException } from "./exceptions/root";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        exception = new InternalException(
          "Internal Server Error",
          error,
          ErrorCode.internalServerError
        );
      }
      next(exception);
    }
  };
};
