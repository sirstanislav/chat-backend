const Message = require('../models/message');
const { ValidationError } = require('../errors/ValidationError');

module.exports.getAllMessage = (req, res, next) => {
  Message.find({})
    .then((message) => {
      res.send(message);
    })
    .catch((err) => next(err));
};

module.exports.createMessage = (req, res, next) => {
  const {
    text, userName,
  } = req.body;

  Message.create({
    text,
    userName,
    owner: req.user._id,
  })
    .then((message) => {
      res.status(201).send(message);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Incorrect data passed when creating a message'));
      }
      next(err);
    });
};
