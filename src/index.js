// Load environment variables from a .env file
require('dotenv').config();

// Import the Express library
const express = require('express');

// Initialize the database connection when the application starts
require('./config/db');

// --- Import Route Handlers ---
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

// Initialize the Express application
const app = express();

// --- Core Middleware ---
// This middleware is essential for parsing incoming request bodies with JSON payloads
app.use(express.json());

// Define the port the server will run on
const PORT = process.env.PORT || 3000;

// --- API Test Routes ---
// A simple root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('EduTrack Backend is running!');
});

// --- API Routers ---
// Direct any requests starting with '/api/users' to the userRoutes handler
app.use('/api/users', userRoutes);

// Direct any requests starting with '/api/courses' to the courseRoutes handler
app.use('/api/courses', courseRoutes);

// Direct any requests starting with '/api/enrollments' to the enrollmentRoutes handler
app.use('/api/enrollments', enrollmentRoutes);


// --- Start the Server ---
// Make the server listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});