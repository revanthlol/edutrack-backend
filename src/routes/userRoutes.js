const express = require('express');
const router = express.Router();

// Import the controller function we just created
const { registerUser } = require('../controllers/userController');

// Define the POST route for '/register'
// When this route is hit, it will now call the 'registerUser' function
router.post('/register', registerUser);

module.exports = router;