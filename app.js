require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');

const limiter = require('./middlewares/limiter');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

// подключаемся к серверу mongo
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
};
mongoose.connect(DB_ADDRESS, options);

const app = express();

app.use(cors({ origin: ['http://localhost:3001', 'https://localhost:3001', 'https://vashinkognito.movies.nomoredomainsrocks.ru', 'http://vashinkognito.movies.nomoredomainsrocks.ru'] }));

// для сборки JSON-файла
app.use(express.json());

// настройка заголовков HTTP, связанные с защитой
app.use(helmet());

// ограничение количества запросов с одного IP-адреса в ед.времени
app.use(limiter);

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// подключаем логгер запросов
app.use(requestLogger);

app.use(router);

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
app.listen(PORT);
