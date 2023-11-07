require('dotenv').config(); // безопасность ключа
const express = require('express');
const json = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate'); // отправить клиенту ошибку
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { router } = require('./routes/index');
const limiter = require('./middlewares/rateLimiter');
const { errorHandler } = require('./middlewares/errorHandler');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const app = express();

const corseAllowedOrigins = [
  'http://diplommovies.nomoredomainsmonster.ru',
  'https://diplommovies.nomoredomainsmonster.ru',
];

app.use(cors({
  origin: corseAllowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(helmet()); // для защиты приложения путем настройки заголовков HTTP

app.use(limiter); // ограничивает количество запросов с одного IP-адреса в единицу времени

mongoose.connect(MONGO_URL); // подключаемся к серверу MongoDB

// после инициализации приложения, но до задействования роутов
app.use(json());
app.use(bodyParser.json()); // для собирания JSON-формата, объединения пакетов
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(requestLogger); // подключаем логгер запросов
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // middleware для ошибок

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
