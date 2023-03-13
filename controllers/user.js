const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');
const { JWT_SECRET_DEV } = require('../const/const');

const { NODE_ENV, JWT_SECRET_PROD } = process.env;

module.exports.signup = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => {
        const data = {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
        res.status(201).send(data);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('409 - User with this email already exists'));
        } else if (err.name === 'ValidationError') {
          next(new ValidationError('400 - Incorrect data passed during user creation'));
        } else {
          next(err);
        }
      }));
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET_PROD : JWT_SECRET_DEV, { expiresIn: '24h' });
      res.send({ token, userId: user._id, name: user.name });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ name: user.name, email: user.email, user_id: user._id });
    })
    .catch((err) => next(err));
};
