const { ERROR_MESSAGES } = require('../utils/constants');
// Если в обработчик пришла ошибка без статуса, возвращайте ошибку сервера.
const errorHandler = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        : message,
    });
  next();
};

module.exports = errorHandler;
