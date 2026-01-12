const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if admin is logged in
const isAdminLoggedIn = (req, res, next) => {
  if (req.session.admin_logged_in) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Delete user (admin only)
router.delete('/:id', isAdminLoggedIn, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user: ' + err.message });
  }
});

module.exports = router;
