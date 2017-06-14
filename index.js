'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const chalk = require('chalk');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const passport = require('passport');
const morgan = require('morgan');
const flash = require('connect-flash');
const boom = require('express-boom');

// @ERRORS
const log = console.log;
const rejected = chalk.red.underline.bold;
const success = chalk.green.underline.bold;
const pendingWarning = chalk.yellow.underline.bold;

// @CONFIG
const config = require('./config/config');
const User = require('./models/User');
require('./config/passport')(passport);

app.set('port', config.PORT);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(expressStatusMonitor());
app.use(morgan('dev'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'youdontknowjavascript'
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(boom());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const MONGO_URI = `mongodb://${config.DBADMIN}:${config.DBPASSWORD}@ds139685.mlab.com:39685/kronendb`;
mongoose.Promise = require('bluebird');

mongoose.connect(MONGO_URI);
mongoose.connection.on('error', (err) => {
  console.error(rejected(err));
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', rejected('✗'));
  process.exit();
});

mongoose.connection.on('open', () => {
  log(success('Mongo is working good!'));
  log(pendingWarning(`hey ${config.DBADMIN} how do u feel today?`));
});

app.get('/', (req, res) => {
  if (req.user && req.user.email === 'kronenberg1991@gmail.com') {
    res.send({message: `${req.user.email} what i can do for you master`});
  } else {
    res.boom.unauthorized('Forbidden! Good luck!');
  }
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

app.get('/login', function(req, res) {
  res.send(req.flash('loginMessage'));
});

app.get('/signup', (req, res) => {
  res.send(req.flash('signupMessage'));
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  const logoutMessage = req.user ? `${req.user.email} logout` : `no session`;
  req.logout();
  res.send({msg: logoutMessage});
});

app.get('/users', (req, res, send) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
})

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('You are not logged in dude!');
}

app.listen(config.PORT, () => {
  log(success('Node app is running on port'), config.PORT);
});


