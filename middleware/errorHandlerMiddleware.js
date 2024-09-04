const errorHandlerMiddleware = (error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json(error.message || 'irgendwas ist in server schiefgelaufen')
}

export default errorHandlerMiddleware
