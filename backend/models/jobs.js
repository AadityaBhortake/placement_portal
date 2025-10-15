const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  id: Number,
  title: String,
  company: String,
  location: String,
  description: String,
  datePosted: String
});

module.exports = mongoose.model('Job', jobSchema);