const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  limit: 150,
  windowMS: 60 * 60 * 1000,
  message: 'В настоящий момент превышено количество запросов на сервер. Пожалуйста, попробуйте повторить позже.',
});

module.exports = limiter;
