const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  role: String,
  studentId: String,
  department: String,
  year: String,
  cgpa: Number,
  skills: [String],
  phone: String,
  address: String,
  resume: String,
  dateOfBirth: String,
  status: String,
  eligibleForPlacements: Boolean,
  appliedPlacements: [Number],
  achievements: [String],
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      github: String
    }
  ],
  registrationDate: String
});

module.exports = mongoose.model('Student', studentSchema);