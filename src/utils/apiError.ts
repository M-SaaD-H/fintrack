interface ApiError {
  statusCode: number;
  message: string;
  data: any;
  success: boolean;
  errors: any[];
}

class ApiError extends Error {
  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}

export { ApiError }