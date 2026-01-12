# Quick Start Guide

## Prerequisites
- Node.js v14+ 
- MongoDB (local or Atlas)
- npm

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/campus_network
PORT=3000
SESSION_SECRET=your_secret_key_here
```

### 3. Start MongoDB

**Local:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud) and update `MONGODB_URI` in `.env`

### 4. Seed Database (Optional)
```bash
node seed.js
```

### 5. Run the App

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Visit: `http://localhost:3000`

## Default Credentials
Create an account with any `@svecw.edu.in` email and password

## Features Available
✅ User Registration & Login  
✅ Mock Interview Quizzes  
✅ Placement Calendar  
✅ User Profile & Performance Charts  
✅ Feedback System  
✅ FAQ/QA Section  
✅ Admin Dashboard (stub)  

## API Documentation
See [README.md](README.md) for complete API endpoints and database schema

## Troubleshooting
1. **MongoDB error**: Ensure `mongod` is running
2. **Port in use**: Change PORT in `.env`
3. **Dependencies error**: Run `npm install` again
4. **Session issues**: Clear cookies and try incognito mode

## Next Steps
1. Customize admin authentication
2. Add email verification
3. Deploy to Heroku/AWS
4. Add real-time notifications
5. Implement file uploads

Happy coding! 🚀
