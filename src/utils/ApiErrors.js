class ApiErrors extends Error {
  constructor(
    message = "Something went wrong",
    statusCode,
    error = [],
    statck = ""
  ) {
    super(message);
    this.statuscode = statusCode;
    this.data = null;
    this.message = message;
    this.sucess = false;
    this.error = error;
    if (stack) {
      this.stack = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { ApiErrors }