const db = require('../config/db');     // Import the database connection pool
const bcrypt = require('bcryptjs');   // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');  // Import jsonwebtoken for creating tokens

/**
 * Controller function to handle new user registration.
 * Validates input, hashes password, and saves the user to the database.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const registerUser = async (req, res) => {
  try {
    // 1. Destructure the required fields from the request body
    const { name, email, password, role } = req.body;

    // 2. Basic Input Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields: name, email, password, and role." });
    }

    // Validate the role
    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified. Must be 'student', 'faculty', or 'admin'." });
    }

    // 3. Check if the user already exists in the database
    const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // 4. Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create the new user object
    const newUser = {
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role
    };

    // 6. Save the new user to the database
    const sql = 'INSERT INTO users SET ?';
    const [result] = await db.query(sql, newUser);

    // 7. Send back a success response
    res.status(201).json({
      message: "User registered successfully!",
      userId: result.insertId // The ID of the newly created user
    });

  } catch (error) {
    // Global error handler
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


/**
 * Controller function to handle user login.
 * Validates credentials and returns a JWT if successful.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const loginUser = async (req, res) => {
  try {
    // 1. Destructure email and password from request body
    const { email, password } = req.body;

    // 2. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    // 3. Find the user by email in the database
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [users] = await db.query(sql, [email]);

    // Check if a user with that email was found
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = users[0];

    // 4. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 5. If password matches, create the JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // 6. Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    
    // 7. Send the token back to the user
    res.json({
      message: "Login successful!",
      token: token
    });

  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


/**
 * Controller function to get the current user's profile.
 * This is a protected route.
 * @param {object} req - Express request object (will have user info attached by middleware)
 * @param {object} res - Express response object
 */
const getUserProfile = async (req, res) => {
  try {
    // Thanks to our 'protect' middleware, req.user is available here
    const userId = req.user.id;

    // Find the user by ID, but do not select the password
    const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    const [users] = await db.query(sql, [userId]);

    if (users.length === 0) {
      // This case is unlikely if token is valid, but good for safety
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error." });
  }
};


// Export all the controller functions to be used in routes
module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};