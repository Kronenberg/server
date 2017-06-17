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
const fileUpload = require('express-fileupload');
// @ERRORS
const log = console.log;
const rejected = chalk.red.underline.bold;
const success = chalk.green.underline.bold;
const pendingWarning = chalk.yellow.underline.bold;

// @ROUTES CONTROLLERS
const homeController = require('./controllers/main');
const authController = require('./controllers/auth');
const userManagementController = require('./controllers/userManagement');

// @CONFIG
const config = require('./config/config');
const User = require('./models/User');
require('./config/passport')(passport);

// @UTILS
const localFileUpload  = require('./utils/uploadFileLocaly');
const checkUserStatus = require('./utils/checkUserStatus');

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
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// app.use((req, res, next) => {
//   if (!req.user &&
//     req.path !== '/login' &&
//     req.path !== '/signup' &&
//     !req.path.match(/^\/auth/) &&
//     !req.path.match(/\./)) {
//     req.session.returnTo = req.path;
//   } else if (req.user &&
//     req.path == '/account') {
//     req.session.returnTo = req.path;
//   }
//   next();
// });

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

app.get('/', homeController.checkAuthMain);

app.post('/uploads', localFileUpload.uploadFile);

app.post('/signup', authController.signUpLocal);
app.post('/login', authController.loginLocal);

app.get('/login', authController.getLoginStatus);
app.get('/signup', authController.getSignUpStatus);
app.get('/profile', checkUserStatus.isLoggedIn, authController.getCurrentUserSession)
app.get('/logout', authController.userLogoutLocal);

app.get('/api/users', userManagementController.getAllUsers);

app.listen(config.PORT, () => {
  log(success('Node app is running on port'), config.PORT);
});


