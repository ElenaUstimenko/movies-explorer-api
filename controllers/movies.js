const mongoose = require('mongoose');
const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

// GET /movies — возвращает все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  const ownerId = req.user._id;
  Movie
    .find({ owner: ownerId })
    .populate('owner', '_id')
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Данные не найдены');
      }
      return res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

// POST /movies — создаёт фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  const ownerId = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: ownerId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      const { _id: movieId } = movie;
      res.status(201).send({ _id: movieId });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// DELETE /movies/:_id — удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  const { _id: movieId } = req.params;
  const userId = req.user._id;
  return Movie.findById(movieId)
    .orFail()
    .populate('owner')
    .then((movie) => {
      const ownerId = movie.owner._id.toString();
      if (ownerId !== userId) {
        throw new ForbiddenError('Невозможно удалить карточку, созданную другим пользователем');
      }
      return movie.deleteOne();
    })
    .then((movieData) => res.status(200).send(movieData))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Передан несуществующий _id: ${movieId}`));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
