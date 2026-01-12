const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

const ALLOWED_EMAIL_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'svecw.edu.in';

// Get Register Page
router.get('/register', (req, res) => {
  res.render('register', { errorMessage: null });
});

// Register Route
router.post('/register', 
  body('email').isEmail().normalizeEmail(),
  body('name').notEmpty(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', { errorMessage: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;
    const emailDomain = email.split('@')[1];

    if (emailDomain !== ALLOWED_EMAIL_DOMAIN) {
      return res.render('register', { errorMessage: `Invalid email domain! Only '@${ALLOWED_EMAIL_DOMAIN}' emails are allowed.` });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('register', { errorMessage: 'Email already exists!' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.redirect('/auth/login');
    } catch (err) {
      res.render('register', { errorMessage: 'Error creating account: ' + err.message });
    }
  }
);

// Get Login Page
router.get('/login', (req, res) => {
  res.render('login', { errorMessage: null });
});

// Login Route
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { errorMessage: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render('login', { errorMessage: 'No user found with this email.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('login', { errorMessage: 'Incorrect password.' });
      }

      req.session.user_email = email;
      res.redirect('/dashboard');
    } catch (err) {
      res.render('login', { errorMessage: 'Login error: ' + err.message });
    }
  }
);

// Admin Login Page
router.get('/admin-login', (req, res) => {
  res.render('admin-login', { errorMessage: null });
});

// Admin Login Route
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  
  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'lathasribtech@gmail.com';
  const ADMIN_PASSWORD = '9989077682';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.admin_logged_in = true;
    req.session.admin_email = email;
    res.redirect('/admin');
  } else {
    res.render('admin-login', { errorMessage: 'Invalid email or password.' });
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.redirect('/');
  });
});

module.exports = router;
