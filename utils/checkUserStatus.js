/**
 * Created by Kronenberg on 6/17/17.
 */

exports.isLoggedIn = function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('You are not logged in dude!');
  }