const { celebrate, Joi } = require('celebrate');

module.exports.postMessage = celebrate({
  body: Joi.object().keys({
    text: Joi.string().required(),
    userName: Joi.string().required(),
  }),
});
