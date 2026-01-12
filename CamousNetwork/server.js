require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer setup for calendar image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'placement-calendar' + ext);
  }
});
const upload = multer({ storage });

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_network';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/faq', require('./routes/faq'));
app.use('/api/placement', require('./routes/placement'));
app.use('/api/interview-questions', require('./routes/interview-questions'));
app.use('/api/mock-questions', require('./routes/mock-questions'));
app.use('/api/users', require('./routes/users'));

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user_email) {
    next();
  } else {
    res.redirect('/login');
  }
};
// Middleware to check if admin is logged in
const isAdminLoggedIn = (req, res, next) => {
  if (req.session.admin_logged_in) {
    next();
  } else {
    res.redirect('/auth/admin-login');
  }
};
// Home Page
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user_email });
});

// Dashboard (after login)
app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.session.user_email });
});

// Profile Page
app.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const User = require('./models/User');
    const QuizScore = require('./models/QuizScore');
    
    const user = await User.findOne({ email: req.session.user_email });
    const scores = await QuizScore.find({ userEmail: req.session.user_email }).sort({ date: -1 });
    
    res.render('profile', { user, scores });
  } catch (err) {
    res.status(500).send('Error loading profile: ' + err.message);
  }
});

// Mock Interview Page
app.get('/mock-interview', isLoggedIn, (req, res) => {
  res.render('mock-interview');
});

// Placement Calendar Page
app.get('/placement-calendar', isLoggedIn, (req, res) => {
  res.render('placement-calendar');
});

// Feedback Page
app.get('/feedback', isLoggedIn, (req, res) => {
  res.render('feedback');
});

// FAQ Page
app.get('/faq', (req, res) => {
  res.render('faq', { user: req.session.user_email });
});

// Interview Questions Page
app.get('/interview-questions', isLoggedIn, (req, res) => {
  res.render('interview-questions');
});

// Admin Dashboard
app.get('/admin', isAdminLoggedIn, (req, res) => {
  res.render('admin-dashboard');
});

// Admin Routes for Managing Data
app.get('/admin/interview-questions', isAdminLoggedIn, async (req, res) => {
  try {
    const InterviewQuestion = require('./models/InterviewQuestion');
    const questions = await InterviewQuestion.find();
    res.render('admin-interview-questions', { questions });
  } catch (err) {
    res.status(500).send('Error loading questions: ' + err.message);
  }
});

app.get('/admin/mock-questions', isAdminLoggedIn, async (req, res) => {
  try {
    const MockQuestion = require('./models/MockQuestion');
    const questions = await MockQuestion.find().sort({ createdAt: -1 });
    res.render('admin-mock-questions', { questions });
  } catch (err) {
    res.status(500).send('Error loading mock questions: ' + err.message);
  }
});

app.get('/admin/placement-events', isAdminLoggedIn, async (req, res) => {
  try {
    const PlacementEvent = require('./models/PlacementEvent');
    const events = await PlacementEvent.find().sort({ eventDate: 1 });
    res.render('admin-placement-events', { events });
  } catch (err) {
    res.status(500).send('Error loading events: ' + err.message);
  }
});

// Upload calendar image (admin)
app.post('/admin/placement-image', isAdminLoggedIn, upload.single('calendarImage'), (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');
    const relPath = '/uploads/' + req.file.filename;
    // write JSON file with image path so client can fetch it
    const jsonPath = path.join(__dirname, 'public', 'placement-calendar-image.json');
    fs.writeFileSync(jsonPath, JSON.stringify({ image: relPath }));
    res.json({ success: true, path: relPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/feedback', isAdminLoggedIn, async (req, res) => {
  try {
    const Feedback = require('./models/Feedback');
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.render('admin-feedback', { feedbacks });
  } catch (err) {
    res.status(500).send('Error loading feedback: ' + err.message);
  }
});

app.get('/admin/faq', isAdminLoggedIn, async (req, res) => {
  try {
    const FAQ = require('./models/FAQ');
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.render('admin-faq', { faqs });
  } catch (err) {
    res.status(500).send('Error loading FAQ: ' + err.message);
  }
});

app.get('/admin/users', isAdminLoggedIn, async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.render('admin-users', { users });
  } catch (err) {
    res.status(500).send('Error loading users: ' + err.message);
  }
});

app.get('/admin/statistics', isAdminLoggedIn, async (req, res) => {
  try {
    const User = require('./models/User');
    const Feedback = require('./models/Feedback');
    const PlacementEvent = require('./models/PlacementEvent');
    const InterviewQuestion = require('./models/InterviewQuestion');
    
    const totalUsers = await User.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const totalEvents = await PlacementEvent.countDocuments();
    const totalQuestions = await InterviewQuestion.countDocuments();
    
    res.render('admin-statistics', {
      totalUsers,
      totalFeedback,
      totalEvents,
      totalQuestions
    });
  } catch (err) {
    res.status(500).send('Error loading statistics: ' + err.message);
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
