const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  id: Number,
  studentId: Number,
  studentName: String,
  placementId: Number,
  placementTitle: String,
  companyId: Number,
  companyName: String,
  applicationDate: String,
  status: String,
  currentRound: String,
  roundsCompleted: [String],
  nextRoundDate: String,
  feedback: {},
  documents: {},
  offerDetails: {},
  lastUpdated: String
});

module.exports = mongoose.model('Application', applicationSchema);