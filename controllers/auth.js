const passport = require('passport');

exports.signUpLocal = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors)
    req.flash('errors', errors);

  passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })(req, res, next);
}
/**
 * POST /login
 * Sign in using email and password.
 */

exports.loginLocal = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors)
    req.flash('errors', errors);

  passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })(req, res, next);
}
exports.getLoginStatus = (req, res) => {
  res.send(req.flash('errors'));
};

exports.getSignUpStatus = (req, res) => {
  res.send(req.flash('errors'));
};

exports.getCurrentUserSession = (req, res) => {
  if (req.user) {
    res.json(req.user);
  }
};

exports.userLogoutLocal = (req, res) => {
  const logoutMessage = req.user ? `${req.user.email} logout` : `no session`;
  req.logout();
  res.send({msg: logoutMessage});
};