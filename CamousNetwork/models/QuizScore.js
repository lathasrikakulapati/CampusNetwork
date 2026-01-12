const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('QuizScore', quizScoreSchema);
