const express = require('express');
const MockQuestion = require('../models/MockQuestion');
const router = express.Router();

// Admin check middleware
const isAdmin = (req, res, next) => {
  if (req.session && req.session.admin_logged_in) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};

// List mock questions
router.get('/', async (req, res) => {
  try {
    const questions = await MockQuestion.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create mock question (admin)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { question, option1, option2, option3, option4, answer } = req.body;
    if (!question || !option1 || !option2 || !option3 || !option4 || !answer) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const mq = new MockQuestion({ question, option1, option2, option3, option4, answer });
    await mq.save();
    res.json({ success: true, question: mq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update mock question (admin)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const updated = await MockQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, question: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete mock question (admin)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await MockQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
