const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  answers: [{
    answer: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FAQ', faqSchema);
