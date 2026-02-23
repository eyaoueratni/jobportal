class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (err, req, res, next) => {
  // Default to internal server error if no specific message or code is set
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handling specific error types
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 400;
    message = "Json Web Token is invalid, try again!";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 400;
    message = "Json Web Token is expired, try again!";
  }

  // Create a new ErrorHandler object for consistency
  const errorResponse = new ErrorHandler(message, statusCode);
  return res.status(errorResponse.statusCode).json({
    success: false,
    message: errorResponse.message,
  });
};

module.exports = { ErrorHandler, errorMiddleware };
