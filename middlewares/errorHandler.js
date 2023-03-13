module.exports = (app) => {
  app.use((err, req, res, next) => {
    if (err.statusCode) {
      res.status(err.statusCode).send({ message: err.message });
    } else {
      res.status(500).send({ message: 'An error occurred on the server' });
    }
    next();
  });
};
