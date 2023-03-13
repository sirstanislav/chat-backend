const router = require('express').Router();

const { getAboutUser } = require('../controllers/user');

router.get('/users/me', getAboutUser);

module.exports = router;
