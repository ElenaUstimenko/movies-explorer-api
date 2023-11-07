const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const AuthorizationError = require('../errors/AuthorizationError');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new AuthorizationError('С токеном что-то не так'));
  }
  req.user = payload;
  return next();
}

module.exports = { auth };
