const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Get all feedback (admin)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching feedback: ' + err.message });
  }
});

// Submit feedback
router.post('/', async (req, res) => {
  if (!req.session.user_email) {
    return res.status(401).json({ error: 'User is not logged in.' });
  }

  const { rating, message } = req.body;

  if (!rating || !message) {
    return res.status(400).json({ error: 'Rating and message are required.' });
  }

  try {
    const feedback = new Feedback({
      rating,
      message,
      userEmail: req.session.user_email,
    });

    await feedback.save();
    res.json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error submitting feedback: ' + err.message });
  }
});

module.exports = router;
