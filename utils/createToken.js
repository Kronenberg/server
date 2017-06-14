/**
 * Created by Kronenberg on 6/14/17.
 */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
function createToken(user) {
  let scope;
  // Check if the user object passed in
  // has admin set to true, and if so, set
  // scopes to admin
  if (user.admin) {
    scope = 'admin';
  }

  // Sign the JWT
  return jwt.sign({
    email: user.email,
    password: user.password
  }, config.SECRET_WEB_TOKEN, {
    algorithm: 'HS256',
    expiresIn: "1h"
  });
}

module.exports = createToken;