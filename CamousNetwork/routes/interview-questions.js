const express = require('express');
const InterviewQuestion = require('../models/InterviewQuestion');
const router = express.Router();

// Get all interview questions
router.get('/', async (req, res) => {
  try {
    const questions = await InterviewQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions: ' + err.message });
  }
});

// Get questions for a specific company
router.get('/company/:company', async (req, res) => {
  try {
    const company = req.params.company;
    const questions = await InterviewQuestion.find({ companyName: company });
    
    // Group by round types
    const data = {};
    questions.forEach(q => {
      const round = q.roundTypes.trim();
      if (!data[round]) {
        data[round] = [];
      }
      data[round].push(q.questions);
    });
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions: ' + err.message });
  }
});

// Add interview question (admin)
router.post('/', async (req, res) => {
  const { companyName, roundTypes, questions } = req.body;

  if (!companyName || !roundTypes || !questions) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const question = new InterviewQuestion({
      companyName,
      roundTypes,
      questions,
    });

    await question.save();
    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ error: 'Error creating question: ' + err.message });
  }
});

// Update interview question (admin)
router.put('/:id', async (req, res) => {
  const { companyName, roundTypes, questions } = req.body;

  try {
    const question = await InterviewQuestion.findByIdAndUpdate(
      req.params.id,
      { companyName, roundTypes, questions },
      { new: true }
    );

    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ error: 'Error updating question: ' + err.message });
  }
});

// Delete interview question (admin)
router.delete('/:id', async (req, res) => {
  try {
    await InterviewQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting question: ' + err.message });
  }
});

module.exports = router;
