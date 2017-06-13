/**
 * Created by Kronenberg on 6/13/17.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
// @add bcrypt
// @add crypt
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: {type: String, required: true }
});
// methods ======================
// generating a hash
UserSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = password => {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
