const router = require('express').Router();
const { validateEditUserInfo } = require('../middlewares/validation');

const {
  getUserInfo,
  editUserInfo,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUserInfo);
// обновляет информацию о пользователе (email и имя)
router.patch('/me', validateEditUserInfo, editUserInfo);

module.exports = router;
