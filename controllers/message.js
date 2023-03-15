const Message = require('../models/message');
const { ValidationError } = require('../errors/ValidationError');

const getAllMessage = (req, res, next) => {
  Message.find()
    .then((message) => {
      res.send(message);
    })
    .catch((err) => next(err));
};

const createMessage = (req, res, next) => {
  const {
    id, owner, userName, text,
  } = req.body;

  Message.create({
    id,
    owner,
    text,
    userName,
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

module.exports = {
  getAllMessage,
  createMessage,
};
