const jwt = require('jsonwebtoken'); // To verify the token
const db = require('../config/db');     // To optionally check if user still exists

/**
 * Middleware to protect routes that require authentication.
 * It verifies the JWT token from the Authorization header.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the token is in the headers and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extract the token from the "Bearer <token>" string
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach the user's info to the request object (excluding password)
      // This makes the user data available to any subsequent protected route
      req.user = decoded.user; 
      
      // We could add an optional check here to see if user `decoded.user.id` still exists in the DB

      next(); // If everything is okay, proceed to the next middleware or the route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  // If there's no token at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

module.exports = { protect };