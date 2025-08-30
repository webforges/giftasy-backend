// Catch all errors
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error stack in console

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || "Server Error",
    // Only show stack in development
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

// Not found middleware (for invalid routes)
export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};
