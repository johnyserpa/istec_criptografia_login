const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const socket_io = require('socket.io');
const socket = require('./socket/socket');

var app = express();
app.use(cors());

const io = socket_io();
app.io = io;
socket(io);


/**
 *
 * Routers.
 *
 */
var index = require('./routes/index');

/**
 *
 * Session handling.
 *
 */
app.use(session({
	secret: 'laranja'
}));

/**
 *
 * Connection to database.
 *
 */
mongoose.connect('mongodb://localhost/criptografia', {
	useMongoClient: true
});

/**
 *
 * Global vars.
 *
 */
app.set('secret', 'banana');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
