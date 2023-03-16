require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const route = require('./routes/index');
const cors = require('./middlewares/cors');
const errorHendler = require('./middlewares/errorHandler');
const { registerConnect } = require('./socket/registerConnect');
const { registerMessage } = require('./socket/registerMessage');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { MONGO_DEV } = require('./const/const');

const { MONGO_PROD, NODE_ENV } = process.env;
const PORT = process.env.PORT || 8080;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_PROD : MONGO_DEV);
mongoose.connection.on('connected', () => {
  console.log('Mongo has connected succesfully');
});
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected');
});
mongoose.connection.on('error', (error) => {
  console.log('Mongo connection has an error', error);
  mongoose.disconnect();
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected');
});

app.use(helmet());
/* Using Helmet to secure the app */
app.disable('x-powered-by');
/* Disable header X-Powered-By */
app.use(bodyParser.json());
/* to collect JSON format data */
app.use(bodyParser.urlencoded({ extended: true }));
/* For receiving web pages inside a POST request */

app.use(requestLogger); /* Connect request logger */
app.use(cors); /* Include cors headers */

route(app); /* All routes are defined here */

app.use(errorLogger); /* ErrorLogger is connected after route handlers and before error handlers */
app.use(errors()); /* Celebrate error handler */

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const onConnection = (socket) => {
  registerConnect(socket);
  registerMessage(socket);
};

io.on('connection', onConnection);

httpServer.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

errorHendler(app); /* Handle all errors here */
