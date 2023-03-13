const { celebrate, Joi } = require('celebrate');
const { isAuthorized } = require('../middlewares/auth');
const { signup, signin } = require('../controllers/user');
const { PageNotFoundError } = require('../errors/PageNotFoundError');
const users = require('./users');
const messages = require('./messages');

module.exports = (app) => {
  app.use(
    '/signup',
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    }),
    signup,
  );

  app.use(
    '/signin',
    celebrate({
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    }),
    signin,
  );

  app.use('/', isAuthorized, users);
  app.use('/', isAuthorized, messages);

  app.use((req, res, next) => {
    next(new PageNotFoundError('404 - Страницы не существует'));
  });
};
