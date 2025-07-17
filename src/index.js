// Load environment variables from .env file.
// THIS MUST BE THE FIRST LINE
require('dotenv').config();

// Import the Express library
const express = require('express');

// Initialize DB connection (this will now have access to the loaded env vars)
require('./config/db');

// Import the user routes
const userRoutes = require('./routes/userRoutes');

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Define the port the server will run on.
const PORT = process.env.PORT || 3000;

// Create a simple route for the root URL ('/')
app.get('/', (req, res) => {
  res.send('EduTrack Backend is running!');
});

// Use the user routes for any URL starting with '/api/users'
app.use('/api/users', userRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});