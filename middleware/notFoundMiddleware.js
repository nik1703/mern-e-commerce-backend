const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Pfad nicht gefunden - ${req.originalUrl}`)

  res.status(404)
  next(error)
}

export default notFoundMiddleware
