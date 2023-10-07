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
const config = require('./utils/config');
const { CORS_URL, CORS_OPTIONS } = require('./utils/constants');

const {
  PORT = config.PORT,
  DB_ADDRESS = config.DB_ADDRESS,
} = process.env;

// подключаемся к серверу mongo
mongoose.connect(DB_ADDRESS, CORS_OPTIONS);

const app = express();

app.use(cors({ origin: CORS_URL }));

// для сборки JSON-файла
app.use(express.json());

// настройка заголовков HTTP, связанные с защитой
app.use(helmet());

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// подключаем логгер запросов
app.use(requestLogger);

// ограничение количества запросов с одного IP-адреса в ед.времени
app.use(limiter);

app.use(router);

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
app.listen(PORT);
