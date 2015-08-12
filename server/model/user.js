var mongoose = require('mongoose');

var User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: false, lowercase: true },
  password: { type: String, select: false },
  type: {type: String, enum:['sellers','customer','admin'], default:'customer'}
}));

module.exports = User;