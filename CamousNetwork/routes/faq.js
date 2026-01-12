const express = require('express');
const FAQ = require('../models/FAQ');
const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching FAQs: ' + err.message });
  }
});

// Post a question
router.post('/question', async (req, res) => {
  if (!req.session.user_email) {
    return res.status(401).json({ error: 'User is not logged in.' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const faq = new FAQ({
      question,
      userEmail: req.session.user_email,
      answers: [],
    });

    await faq.save();
    res.json({ success: true, message: 'Question posted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error posting question: ' + err.message });
  }
});

// Add answer to a question (admin or any logged-in user)
router.post('/answer/:id', async (req, res) => {
  if (!req.session.user_email) {
    return res.status(401).json({ error: 'User is not logged in.' });
  }

  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ error: 'Answer is required.' });
  }

  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          answers: {
            answer,
            userEmail: req.session.user_email,
            answeredAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ error: 'Error adding answer: ' + err.message });
  }
});

module.exports = router;
