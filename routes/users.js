const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserMe,
  updateUser,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
userRoutes.get('/me', getUserMe);

// обновляет информацию о пользователе (email и имя)
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = userRoutes;
