const express = require('express');
const router = express.Router();

// Import controller functions
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/userController');

// Import the authentication middleware
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
// To get the profile, the user must provide a valid token.
// The 'protect' middleware will run before 'getUserProfile'.
router.get('/profile', protect, getUserProfile);


module.exports = router;