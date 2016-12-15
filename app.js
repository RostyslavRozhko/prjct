var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var index = require('./routes/index');
var ideas = require('./routes/ideas');
var partners = require('./routes/partners');
var login = require('./routes/login');
var register = require('./routes/register');
var messages = require('./routes/messages');

var mongoose = require('./db/db');
var db = require('./db/api');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'SECRET',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var User = require('./db/UserModel');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password,done){
    db.findLocalUser(username, password, done)
}));

passport.use(new GoogleStrategy({
      clientID: "694329244278-lbf1v6mpoef6kqfqc6rpfh0ogpvlfvmb.apps.googleusercontent.com",
      clientSecret: "ZuRR8NmJf9dNnWJQZkcvFWOc",
      callbackURL: "http://127.0.0.1:3000/login/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        db.findOrCreateGoogleUser(accessToken, refreshToken, profile, done);
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err
        ? done(err)
        : done(null,user);
  });
});


app.use('/', index);
app.use('/ideas', ideas);
app.use('/partners', partners);

app.use('/login',  login);
app.use('/register', register);
app.use('/messages', messages);




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
