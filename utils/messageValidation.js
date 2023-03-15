const { celebrate, Joi } = require('celebrate');

module.exports.postMessage = celebrate({
  body: Joi.object().keys({
    id: Joi.string().required(),
    owner: Joi.string().required(),
    text: Joi.string().required(),
    userName: Joi.string().required(),
  }),
});
