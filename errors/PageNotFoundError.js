class PageNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PageNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = { PageNotFoundError };
