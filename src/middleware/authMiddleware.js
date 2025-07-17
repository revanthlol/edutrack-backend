const jwt = require('jsonwebtoken');

// The 'protect' middleware remains the same.
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

/**
 * Middleware to authorize users based on their role.
 * This should be used *after* the 'protect' middleware.
 * @param {...string} roles - A list of roles that are allowed to access the route.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is attached by the 'protect' middleware
    if (!req.user || !roles.includes(req.user.role)) {
      // 403 Forbidden is the appropriate status code for this.
      // It means the server understood the request but refuses to authorize it.
      return res.status(403).json({ message: 'User role not authorized to access this route.' });
    }
    next(); // User has the correct role, proceed.
  };
};

module.exports = { protect, authorize }; // Export both middlewares