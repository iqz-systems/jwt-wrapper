export abstract class ErrorBase extends Error {

  message: string;
  code: string;
  extra: object;

  constructor(message: string, code: string) {
    super(message);

    this.message = message;
    this.code = code;
    this.extra = {};

    // Capturing stack trace
    Error.captureStackTrace(this);
  }
}
