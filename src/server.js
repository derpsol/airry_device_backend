const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');
const helmet = require('helmet');
const routes = require('./routes');
const config = require('./config');
const APIError = require('./helpers/APIError');
const app = require("express")();
const http = require('http');
const socketIO = require('socket.io');

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

const server = http.createServer(app);

var io = socketIO(server, {
  cors: {
    origins: '*:*'
  }
});

io.on('connection', (socket) => {
  socket.join("fightRoom");
  console.log('entered');

  socket.on('receive', () => {
    socket.emit('savedRoom');
  })
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    // validation error contains details object which has error message attached to error property.
    const allErrors = err.details.map((pathErrors) => Object.values(pathErrors).join(', '));
    const unifiedErrorMessage = allErrors.join(', ').replace(/, ([^,]*)$/, ' and $1');
    const error = new APIError(unifiedErrorMessage, err.statusCode);
    return next(error);
  }
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

app.use((req, res, next) => {
  const err = new APIError('API Not Found', httpStatus.NOT_FOUND);
  return next(err);
});

app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {},
}));

module.exports = server;