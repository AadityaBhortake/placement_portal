const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  id: Number,
  title: String,
  companyId: Number,
  companyName: String,
  description: String,
  requirements: {
    minimumCGPA: Number,
    eligibleDepartments: [String],
    skillsRequired: [String],
    experienceLevel: String,
    preferredSkills: [String]
  },
  jobDetails: {
    position: String,
    ctc: String,
    location: String,
    workMode: String,
    bondPeriod: String,
    joiningDate: String
  },
  selectionProcess: {
    rounds: [String],
    duration: String
  },
  applicationDeadline: String,
  driveDate: String,
  status: String,
  postedDate: String,
  applicationsCount: Number,
  maxApplications: Number
});

module.exports = mongoose.model('Placement', placementSchema);