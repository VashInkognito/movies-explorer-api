const URL_PATTERN = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

const ERROR_MESSAGES = {
  INCORRECT_DATA: 'Переданы некорректные данные',
  INCORRECT_AUTHORIZATION_DATA: 'Неправильная почта или пароль',
  USER_CONFLICT: 'Пользователь с таким email уже существует',
  USER_NOT_FOUND: 'Пользователь не найден',
  MOVIE_NOT_FOUND: 'Фильм не найден',
  PAGE_NOT_FOUND: 'Страница не найдена',
  FORBIDDEN: 'Доступ ограничен',
  UNAUTHORIZED: 'Необходима авторизация',
  INTERNAL_SERVER_ERROR: 'На сервере произошла ошибка',
  INCORRECT_URL: 'Введите корректный URL-адрес',
};

const CORS_URL = ['http://localhost:3001', 'https://localhost:3001', 'https://vashinkognito.movies.nomoredomainsrocks.ru', 'http://vashinkognito.movies.nomoredomainsrocks.ru'];

const CORS_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
};

module.exports = {
  URL_PATTERN,
  ERROR_MESSAGES,
  CORS_URL,
  CORS_OPTIONS,
};
