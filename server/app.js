var config = require('./config.js');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

// custom middleware
var errorHandler = require('./middleware/errorhandler');
var routes = require('./routes/routes');
/*var users = require('./routes/users');

var login = require('./routes/login');
var secure = require('./routes/secure');
var unsecure = require('./routes/unsecuredapi');
var utils = require('./middleware/utils');
*/ 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};


app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(config.db + "/" + config.db_name ,function(err) {
     if (err) console.log(err);
});



app.use('/', routes);

/* app.use('/users', users);
app.use('/auth/login', login);

app.use('/secure/secure',utils.isAuthenicated, secure);

app.use('/test', unsecure);
// catch 404 and forward to error handler
app.use(errorHandler.error);
app.use(errorHandler.notFound); */
console.log(app.get('env'));
// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
