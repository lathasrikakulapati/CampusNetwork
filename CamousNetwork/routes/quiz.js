const express = require('express');
const MockQuestion = require('../models/MockQuestion');
const QuizScore = require('../models/QuizScore');
const router = express.Router();

// Get all mock interview questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await MockQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions: ' + err.message });
  }
});

// Submit quiz and save score
router.post('/submit', async (req, res) => {
  if (!req.session.user_email) {
    return res.status(401).json({ error: 'User is not logged in.' });
  }

  try {
    const questions = await MockQuestion.find();
    let score = 0;

    for (const question of questions) {
      const userAnswer = req.body[`question_${question._id}`];
      if (userAnswer === question.answer) {
        score++;
      }
    }

    const quizScore = new QuizScore({
      userEmail: req.session.user_email,
      score,
      date: new Date(),
    });

    await quizScore.save();
    res.json({ score, total: questions.length });
  } catch (err) {
    res.status(500).json({ error: 'Error submitting quiz: ' + err.message });
  }
});

module.exports = router;
