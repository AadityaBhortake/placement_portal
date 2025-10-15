const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  role: String,
  designation: String,
  department: String,
  phone: String,
  permissions: [String],
  registrationDate: String,
  lastLogin: String,
  status: String
});

module.exports = mongoose.model('Admin', adminSchema);