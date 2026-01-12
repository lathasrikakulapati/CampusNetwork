# Campus Network - Node.js + MongoDB Version

A full-stack web application for campus placement preparation, converted from PHP + MySQL to Node.js + MongoDB.

## Features

- **User Authentication**: Register and login with college email domain validation
- **Mock Interviews**: Practice with interview questions and track scores
- **Placement Calendar**: View upcoming placement drives and company details
- **User Profile**: Track quiz performance with charts and analytics
- **Feedback System**: Submit and manage feedback
- **FAQ Section**: Ask questions and get community answers
- **Admin Dashboard**: Manage content (questions, events, feedback, FAQs)

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: EJS Templates + Vanilla JavaScript
- **Authentication**: bcryptjs for password hashing, Express sessions
- **Validation**: express-validator

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** (comes with Node.js)

## Installation

### 1. Clone or Extract the Project

```bash
cd nodejs-mongodb-version
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/campus_network
PORT=3000
SESSION_SECRET=your_secure_random_key_here
NODE_ENV=development
ALLOWED_EMAIL_DOMAIN=svecw.edu.in
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
# or
mongod
```

**MongoDB Atlas (Cloud):**
Replace `MONGODB_URI` in `.env` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_network
```

### 5. Seed Initial Data (Optional)

```bash
node seed.js
```

This will populate sample mock questions and placement events.

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Requires `nodemon` (installed via `npm install`).

### Production Mode

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
nodejs-mongodb-version/
├── models/
│   ├── User.js                 # User schema
│   ├── MockQuestion.js         # Quiz questions schema
│   ├── QuizScore.js            # Quiz scores schema
│   ├── PlacementEvent.js       # Placement drives schema
│   ├── Feedback.js             # Feedback schema
│   └── FAQ.js                  # FAQ schema
├── routes/
│   ├── auth.js                 # Authentication routes (register, login, logout)
│   ├── quiz.js                 # Quiz routes
│   ├── feedback.js             # Feedback routes
│   ├── faq.js                  # FAQ routes
│   └── placement.js            # Placement calendar routes
├── views/
│   ├── index.ejs               # Home page
│   ├── register.ejs            # Registration page
│   ├── login.ejs               # Login page
│   ├── dashboard.ejs           # User dashboard
│   ├── profile.ejs             # User profile with score chart
│   ├── mock-interview.ejs      # Quiz page
│   ├── placement-calendar.ejs  # Placement calendar
│   ├── feedback.ejs            # Feedback form
│   ├── faq.ejs                 # FAQ page
│   ├── admin-dashboard.ejs     # Admin panel
│   └── 404.ejs                 # 404 error page
├── public/
│   └── styles.css              # Global styles
├── server.js                   # Main Express app
├── seed.js                     # Database seeding script
├── package.json                # Dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  createdAt: Date
}
```

### Mock Questions Collection
```javascript
{
  question: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String,
  createdAt: Date
}
```

### Quiz Scores Collection
```javascript
{
  userEmail: String,
  score: Number,
  date: Date
}
```

### Placement Events Collection
```javascript
{
  eventDate: Date,
  companyName: String,
  rounds: Number,
  roundTypes: String,
  createdAt: Date
}
```

### Feedback Collection
```javascript
{
  rating: Number (1-5),
  message: String,
  userEmail: String,
  createdAt: Date
}
```

### FAQ Collection
```javascript
{
  question: String,
  userEmail: String,
  answers: [{
    answer: String,
    answeredBy: String,
    answeredAt: Date
  }],
  createdAt: Date
}
```

## API Endpoints

### Authentication
- `GET /register` - Registration page
- `POST /auth/register` - Register new user
- `GET /login` - Login page
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### Pages (Require Authentication)
- `GET /dashboard` - User dashboard
- `GET /profile` - User profile
- `GET /mock-interview` - Mock interview quiz
- `GET /placement-calendar` - Placement calendar
- `GET /feedback` - Feedback form
- `GET /faq` - FAQ page

### API Routes
- `GET /api/quiz/questions` - Get all quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/placement` - Get placement events
- `POST /api/placement` - Create placement event (admin)
- `PUT /api/placement/:id` - Update placement event (admin)
- `DELETE /api/placement/:id` - Delete placement event (admin)
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/faq` - Get all FAQs
- `POST /api/faq/question` - Post FAQ question
- `POST /api/faq/answer/:id` - Add answer to FAQ

## Key Differences from PHP Version

| Feature | PHP Version | Node.js Version |
|---------|------------|-----------------|
| Framework | Vanilla PHP | Express.js |
| Database | MySQL | MongoDB |
| Sessions | PHP Sessions | express-session |
| Password Hashing | password_hash() | bcryptjs |
| Templating | Inline HTML | EJS Templates |
| API Style | Server-side routes | REST API |
| Frontend | Server-side rendering | Mixed (EJS + AJAX) |

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For local MongoDB, try: `mongodb://localhost:27017/campus_network`

### Port Already in Use
Change `PORT` in `.env` or kill the process using that port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Module Not Found Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Session/Cookie Issues
- Clear browser cookies
- Try incognito/private browsing mode
- Ensure `SESSION_SECRET` is set in `.env`

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Real-time notifications
- [ ] File uploads for documents
- [ ] Advanced analytics dashboard
- [ ] Multiple login roles (student, admin, coordinator)
- [ ] Interview scheduling system
- [ ] Result analytics and reports

## Migration Notes

This project was converted from a PHP + MySQL application to Node.js + MongoDB. Key changes:

1. **Database**: MySQL → MongoDB (NoSQL document-based)
2. **ORM**: Raw SQL queries → Mongoose schemas and models
3. **Backend**: PHP → Node.js Express
4. **Sessions**: PHP sessions → express-session with MongoDB/memory store
5. **Templating**: Inline PHP → EJS templates
6. **Validation**: Manual PHP validation → express-validator
7. **Authentication**: Manual bcrypt implementation → bcryptjs library

## License

This project is for educational purposes.

## Support

For issues or questions, please open an issue in the repository.
