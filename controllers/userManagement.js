/**
 * Created by Kronenberg on 6/17/17.
 */

const User = require('../models/User');

exports.getAllUsers = (req, res, send) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
};