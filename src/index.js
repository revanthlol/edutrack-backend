// Load environment variables from a .env file
require('dotenv').config();

// Import the Express library
const express = require('express');

// Initialize the Express application
const app = express();

// Define the port the server will run on.
// It will use the PORT from the .env file, or default to 3000
const PORT = process.env.PORT || 3000;

// Create a simple route for the root URL ('/')
app.get('/', (req, res) => {
  res.send('EduTrack Backend is running!');
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});