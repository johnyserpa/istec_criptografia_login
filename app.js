const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var app = express();
app.use(cors());

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
mongoose.connect('mongodb://heroku_gqxnwk4l:gmifaqohe7vupiqqmt2ogd7ron@ds113626.mlab.com:13626/heroku_gqxnwk4l', {
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
app.use(express.static(path.join(__dirname, 'public/dist')));


app.use('/', index);
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

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
