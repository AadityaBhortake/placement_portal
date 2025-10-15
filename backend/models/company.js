const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  role: String,
  website: String,
  industry: String,
  location: String,
  companySize: String,
  description: String,
  phone: String,
  establishedYear: Number,
  hrContactPerson: String,
  hrEmail: String,
  hrPhone: String,
  status: String,
  registrationDate: String,
  placementDrives: [Number],
  requirements: {
    minimumCGPA: Number,
    preferredDepartments: [String],
    skillsRequired: [String]
  }
});

module.exports = mongoose.model('Company', companySchema);