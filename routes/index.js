const router = require('express').Router();

const { createUserInfo, login } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err'); // 404
const { ERROR_MESSAGES } = require('../utils/constants');

// роуты, не требующие авторизации
router.post('/signup', validateCreateUser, createUserInfo);
router.post('/signin', validateLogin, login);

// авторизация
router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.PAGE_NOT_FOUND));
});

module.exports = router;
