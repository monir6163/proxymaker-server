import { HttpException } from "./root";

export class InternalException extends HttpException {
  public message: string;
  public errorCode: number;
  public errors: any;

  constructor(message: string, errorCode: number, errors: any) {
    super(message, errorCode, 500, errors);
    this.message = message;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}
