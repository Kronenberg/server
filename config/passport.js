/**
 * Created by Kronenberg on 6/13/17.
 */

// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/User');
var flash           = require('connect-flash');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

    process.nextTick(function() {
        User.findOne({ 'email' :  email }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            return done(null, false, req.flash('signupMessage', {errors: 'That email is already taken.' }));
          } else {
            const newUser            = new User();

            newUser.email    = email;
            newUser.password = newUser.generateHash(password);

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

      User.findOne({ 'email' :  email }, function(err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, req.flash('loginMessage', {errors: 'No user found.'} )); // req.flash is the way to set flashdata using connect-flash

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', {errors: 'Oops! Wrong password.' } )); // create the loginMessage and save it to session as flashdata

        return done(null, user);
      });
    }));
};


