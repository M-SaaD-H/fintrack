class ApiError extends Error {
  statusCode: number;
  message: string;
  data: {} | null;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: string[] = [],
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