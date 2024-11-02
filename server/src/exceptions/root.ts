export class HttpException extends Error {
  public message: string;
  public errorCode: any;
  public statusCode: number;
  public error: ErrorCode;

  constructor(message: string, errorCode: any, statusCode: number, error: any) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export enum ErrorCode {
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  internalServerError = 500,
  badGateway = 502,
  serviceUnavailable = 503,
  gatewayTimeout = 504,
  exists = 409,
  invalid = 400,
}
