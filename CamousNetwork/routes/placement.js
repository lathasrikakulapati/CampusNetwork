const express = require('express');
const PlacementEvent = require('../models/PlacementEvent');
const router = express.Router();

// Get all placement events
router.get('/', async (req, res) => {
  try {
    const events = await PlacementEvent.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events: ' + err.message });
  }
});

// Add placement event (admin)
router.post('/', async (req, res) => {
  const { eventDate, companyName, rounds, roundTypes } = req.body;

  if (!eventDate || !companyName) {
    return res.status(400).json({ error: 'Event date and company name are required.' });
  }

  try {
    const event = new PlacementEvent({
      eventDate,
      companyName,
      rounds: rounds || 1,
      roundTypes,
    });

    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: 'Error creating event: ' + err.message });
  }
});

// Update placement event (admin)
router.put('/:id', async (req, res) => {
  const { rounds, roundTypes } = req.body;

  try {
    const event = await PlacementEvent.findByIdAndUpdate(
      req.params.id,
      { rounds, roundTypes },
      { new: true }
    );

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: 'Error updating event: ' + err.message });
  }
});

// Delete placement event (admin)
router.delete('/:id', async (req, res) => {
  try {
    await PlacementEvent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event: ' + err.message });
  }
});

module.exports = router;
