const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message})
  }
  if (err.isJoi || err.name === 'SequelizeValidationError') return res.status(400).json({ message: 'Некорректные данные запроса' });
  if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Такая запись уже существует' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Запрос слишком большой' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Некорректный JSON' });
  // SQL errors may contain complete query values, including password hashes.
  console.error('API request failed:', err.name || 'Error');
  return res.status(500).json({message: 'Непредввиденная ошибка!'})
}
