export const notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
};

export const errorHandler = (error, _req, res, _next) => {
  if (error.name === "ValidationError") {
    return res.status(422).json({
      message: "Validation failed",
      errors: Object.fromEntries(
        Object.entries(error.errors).map(([field, detail]) => [field, detail.message]),
      ),
    });
  }

  if (error.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const status = error.message === "Origin is not allowed by CORS" ? 403 : 500;
  if (status === 500) console.error(error);
  return res.status(status).json({
    message: status === 500 ? "Internal server error" : error.message,
  });
};
