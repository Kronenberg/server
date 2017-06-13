'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const chalk = require('chalk');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const passport = require('passport');
const morgan = require('morgan');
const flash = require('connect-flash');


// @ERRORS
const log = console.log; // da mne delat nehui, a chego bi i net
const rejected = chalk.red.underline.bold;
const success = chalk.green.underline.bold;
const pendingWarning = chalk.yellow.underline.bold;
// это так чисто по приколу

// @CONFIG
const config = require('./config/config');
const User = require('./models/User');
require('./config/passport')(passport); // pass passport for configuration

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
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const MONGO_URI = `mongodb://${config.DBADMIN}:${config.DBPASSWORD}@ds139685.mlab.com:39685/kronendb`;
mongoose.Promise = require('bluebird');
// леля для тебя теперь библиотека монгус сделала деприкайт на свой родной класс промиссов
// дай ей бог здоровья и теперь надо использовать синюю птичку ее можно юзать в сам колл вызова или повесить так как я тупо на дифолт и не ебать себе мозг все
// спасибо за внимание
mongoose.connect(MONGO_URI);
mongoose.connection.on('error', (err) => {
  console.error(rejected(err));
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', rejected('✗'));
  process.exit();
});

mongoose.connection.on('open', () => {
  log(success('Mongo is working good!'));
  log(pendingWarning(`hey ${config.DBADMIN} how do u feel today?`));
  // это монго со мной здаровается и говорит привет мне важно знать что у нее все хорошо а не как у меня
});


app.get('/', (req, res) => {
  res.send('...');
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

// process the login form
// app.post('/login', do all our passport stuff here);

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
app.get('/signup', (req, res) => {
  res.send(req.flash('signupMessage'));
});


app.get('/profile', isLoggedIn, (req, res) => {
  const data = JSON.stringify(req.flash('loginMessage'))
  res.send(data);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.send('logout done');
});

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


