require('dotenv').config();
const mongoose = require('mongoose');
const MockQuestion = require('./models/MockQuestion');
const PlacementEvent = require('./models/PlacementEvent');
const InterviewQuestion = require('./models/InterviewQuestion');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_network';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected for seeding');

  // Clear existing data
  await MockQuestion.deleteMany({});
  await PlacementEvent.deleteMany({});
  await InterviewQuestion.deleteMany({});

  // Seed mock questions
  const mockQuestions = [
    {
      question: "What is the time complexity of binary search?",
      option1: "O(n)",
      option2: "O(log n)",
      option3: "O(n^2)",
      option4: "O(n log n)",
      answer: "O(log n)"
    },
    {
      question: "Which data structure is used for implementing Undo/Redo?",
      option1: "Queue",
      option2: "Stack",
      option3: "Tree",
      option4: "Graph",
      answer: "Stack"
    },
    {
      question: "What is the main purpose of OOP?",
      option1: "To write faster code",
      option2: "To organize code into reusable modules",
      option3: "To eliminate all bugs",
      option4: "To use less memory",
      answer: "To organize code into reusable modules"
    },
    {
      question: "Which sorting algorithm has the best average case time complexity?",
      option1: "Bubble Sort",
      option2: "Merge Sort",
      option3: "Selection Sort",
      option4: "Insertion Sort",
      answer: "Merge Sort"
    },
    {
      question: "What is a deadlock in multithreading?",
      option1: "When all threads crash",
      option2: "When two threads wait for each other indefinitely",
      option3: "When a thread finishes execution",
      option4: "When memory runs out",
      answer: "When two threads wait for each other indefinitely"
    }
  ];

  await MockQuestion.insertMany(mockQuestions);
  console.log('✓ Mock questions seeded');

  // Seed placement events
  const placementEvents = [
    {
      eventDate: new Date('2026-02-15'),
      companyName: "Google",
      rounds: 4,
      roundTypes: "Online Assessment, Technical Interview, Manager Round, HR Round"
    },
    {
      eventDate: new Date('2026-02-20'),
      companyName: "Microsoft",
      rounds: 3,
      roundTypes: "Coding Test, Technical Interview, HR Round"
    },
    {
      eventDate: new Date('2026-03-01'),
      companyName: "Amazon",
      rounds: 5,
      roundTypes: "Online Assessment, Phone Screen, Technical Rounds (2), Bar Raiser, HR"
    },
    {
      eventDate: new Date('2026-03-10'),
      companyName: "Meta",
      rounds: 4,
      roundTypes: "Online Assessment, Technical Interview, System Design, HR"
    },
    {
      eventDate: new Date('2026-03-15'),
      companyName: "Apple",
      rounds: 3,
      roundTypes: "Technical Round, System Design, HR"
    }
  ];

  await PlacementEvent.insertMany(placementEvents);
  console.log('✓ Placement events seeded');

  // Seed interview questions
  const interviewQuestions = [
    {
      companyName: "Google",
      roundTypes: "Online Assessment",
      questions: "Write a function to reverse a string without using built-in functions"
    },
    {
      companyName: "Google",
      roundTypes: "Online Assessment",
      questions: "Find the longest substring without repeating characters"
    },
    {
      companyName: "Google",
      roundTypes: "Technical Interview",
      questions: "Design a LRU Cache"
    },
    {
      companyName: "Microsoft",
      roundTypes: "Coding Test",
      questions: "Implement a binary tree level order traversal"
    },
    {
      companyName: "Microsoft",
      roundTypes: "Technical Interview",
      questions: "Explain the concept of microservices architecture"
    },
    {
      companyName: "Amazon",
      roundTypes: "Online Assessment",
      questions: "Find the number of islands in a 2D grid"
    },
    {
      companyName: "Amazon",
      roundTypes: "Technical Rounds",
      questions: "Design an e-commerce shopping cart system"
    },
    {
      companyName: "Meta",
      roundTypes: "Online Assessment",
      questions: "Maximum sum of subarray (Kadane's algorithm)"
    },
    {
      companyName: "Meta",
      roundTypes: "System Design",
      questions: "Design a real-time messaging system like Facebook Messenger"
    },
    {
      companyName: "Apple",
      roundTypes: "Technical Round",
      questions: "Merge K sorted lists"
    }
  ];

  await InterviewQuestion.insertMany(interviewQuestions);
  console.log('✓ Interview questions seeded');

  console.log('✓ Database seeding completed successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
