const allowedCors = ['https://chat-frontend-u3jf.onrender.com', 'http://chat-frontend-u3jf.onrender.com', 'http://localhost:3000'];

module.exports = (req, res, next) => {
  const { origin } = req.headers; /* Save the origin of the request to the origin variable */
  const { method } = req; /* Save the request type (HTTP method) to the appropriate variable */

  /* Default value for the Access-Control-Allow-Methods header (all request types are allowed) */
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  /* Save the list of original request headers */
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    /* set a header that allows browser requests from this origin */
    res.header('Access-Control-Allow-Origin', origin);
  }

  /* If this is a preliminary request, add the necessary headers */
  if (method === 'OPTIONS') {
    /* Allow cross-domain requests of any type (default) */
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    /* Allow cross-domain requests with these headers */
    res.header('Access-Control-Allow-Headers', requestHeaders);
    /* Finish processing the request and return the result to the client */
    return res.end();
  }

  return next();
};
