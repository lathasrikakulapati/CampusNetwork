const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  roundTypes: {
    type: String,
    required: true,
  },
  questions: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
