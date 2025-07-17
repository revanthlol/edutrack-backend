const express = require('express');
const router = express.Router();

// Import the controller functions
const { registerUser, loginUser } = require('../controllers/userController');

// Define the POST route for '/register'
router.post('/register', registerUser);

// Define the POST route for '/login'
router.post('/login', loginUser); // Add this new route

module.exports = router;