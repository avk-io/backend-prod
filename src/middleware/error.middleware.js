const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const isProduction = process.env.NODE_ENV === "production";

  console.error("ERROR:", err);

  res.status(statusCode).json({
    success: false,
    message: isProduction
      ? "Internal Server Error"
      : err.message
  });
};

module.exports = errorMiddleware;