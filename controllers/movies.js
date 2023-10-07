const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-err'); // 400
const ForbiddenError = require('../errors/forbidden-err'); // 403
const NotFoundError = require('../errors/not-found-err'); // 404
const { ERROR_MESSAGES } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_DATA));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERROR_MESSAGES.MOVIE_NOT_FOUND);
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      } return Movie.deleteOne(movie)
        .then((deleteMovie) => res.status(200).send({ deleteMovie }));
    })
    .catch(next);
};
