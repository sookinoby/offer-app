var mongoose = require('mongoose');

var User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  type: {type: String, enum:['sellers','customer','admin'], default:'customer'},
  userName: { type: String,lowercase: true}
}));

module.exports = User;