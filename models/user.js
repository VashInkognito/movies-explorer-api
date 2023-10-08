const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/unauthorized-err'); // 401
const { ERROR_MESSAGES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: ERROR_MESSAGES.INCORRECT_URL,
    },
  },
  password: {
    type: String,
    required: true,
    //  API не возвращал хеш пароля
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
