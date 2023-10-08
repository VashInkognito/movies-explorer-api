const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-err'); // 409
const { ERROR_MESSAGES } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.editUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(ERROR_MESSAGES.USER_CONFLICT));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_DATA));
      }
      return next(err);
    });
};

module.exports.createUserInfo = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create(
      {
        ...req.body, password: hash,
      },
    ))
    .then(({
      name, email, _id,
    }) => res.status(201).send({
      name, email, _id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(ERROR_MESSAGES.USER_CONFLICT));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_DATA));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(next);
};
