// Load environment variables from a .env file
require('dotenv').config();

// Import the Express library
const express = require('express');

// Initialize the Database connection pool, which will also log a success message
require('./config/db');

// --- Route Imports ---
// Import all the route handlers from our routes directory
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const reportingRoutes = require('./routes/reportingRoutes');

// Initialize the Express application
const app = express();

// --- Core Middleware ---
// Add middleware to parse incoming JSON payloads from request bodies
// This is essential for handling POST and PUT requests
app.use(express.json());

// Define the port the server will run on
const PORT = process.env.PORT || 3000;

// --- API Routes ---
// A simple health-check route for the root URL
app.get('/', (req, res) => {
  res.send('EduTrack Backend is running!');
});

// Mount the imported route handlers to specific URL prefixes
app.use('/api/users', userRoutes);         // All user-related routes (register, login, profile)
app.use('/api/courses', courseRoutes);       // All course CRUD routes
app.use('/api/enrollments', enrollmentRoutes); // All enrollment and grading routes
app.use('/api/reports', reportingRoutes);      // All reporting and analytics routes


// --- Server Startup ---
// Start the server and listen for incoming requests on the configured port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});