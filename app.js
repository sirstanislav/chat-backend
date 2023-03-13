require('dotenv').config();
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const WebSockets = require('./socket/webSocket');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const route = require('./routes/index');
const errorHendler = require('./middlewares/errorHandler');
const { MONGO_DEV, PORT_DEV } = require('./const/const');

const { PORT_PROD, MONGO_PROD, NODE_ENV } = process.env;

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

app.use(helmet()); // using Helmet
app.disable('x-powered-by'); // disable header X-Powered-By
app.use(bodyParser.json()); // to collect JSON format
app.use(bodyParser.urlencoded({ extended: true })); // for receiving web pages inside a POST request
app.use(requestLogger); // connect request logger
app.use(cors); // include cors headers

route(app); // All routes

app.use(errorLogger); // errorLogger is connected after route handlers and before error handlers
app.use(errors()); // celebrate error handler

const server = http.createServer(app);

global.io = socketio(server.listen(NODE_ENV === 'production' ? PORT_PROD : PORT_DEV, () => {}));
global.io.on('connection', WebSockets.connection);

errorHendler(app); // handle all errors here

// app.listen(NODE_ENV === 'production' ? PORT_PROD : PORT_DEV, () => {});
