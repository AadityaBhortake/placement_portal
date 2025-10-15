const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  email: String,
  registeredAt: String
});

module.exports = mongoose.model('User', userSchema);