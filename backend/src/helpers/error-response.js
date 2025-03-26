class ErrorResponse {
  constructor(message, statusCode, meta) {
    this.message = message;
    this.statusCode = statusCode;
    this.meta = meta;
  }
}

module.exports = { ErrorResponse };
