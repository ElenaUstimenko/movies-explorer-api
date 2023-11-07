const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const routerSignup = require('./signup');
const routerSignin = require('./signin');
const { auth } = require('../middlewares/auth');
const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.use('/', routerSignup);
router.use('/', routerSignin);
router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.all('*', (req, res, next) => {
  throw next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = { router };
