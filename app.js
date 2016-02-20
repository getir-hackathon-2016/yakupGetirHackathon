var express = require('express');
var socket_io = require("socket.io");
var engine = require('ejs-mate');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/getir');
mongoose.connect('mongodb://yakup:yakup@ds031098.mongolab.com:31098/heroku_xvj6pjrh');
var db = mongoose.connection;


var routes = require('./routes/index');
var users = require('./routes/users');
var address = require('./routes/address');
var products = require('./routes/products');
var cart = require('./routes/cart');

var app = express();

// Socket.io
var io = socket_io();
app.io = io;

app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// File Uploads
var upload = multer({ dest: 'uploads/' })
// app.use(multer({dest: './uploads'}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Handle Express Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave:true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/address', address);
app.use('/products', products);
app.use('/cart', cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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



usernames = [];

//start listen with socket.io
app.io.sockets.on('connection', function (socket) {
  console.log('User Connected.');

  socket.on('add cart', function (data, callback) {
    console.log('Add Cart' + data);
    if (usernames.indexOf(data) != -1 || data.trim() == "") {
      callback(false);
    }
    else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
      msg = socket.username + " joined chat";
      io.sockets.emit('new message', {user: socket.username, msg: msg});
    }
  });

  // Update Usernames
  function updateUsernames() {
    io.sockets.emit('usernames', usernames);
  }

  socket.on('send message', function (data) {
    console.log('Send Message');
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  // Disconnect
  socket.on('disconnect', function (data) {
    if (!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  })
});


module.exports = app;
