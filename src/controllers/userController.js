const db = require('../config/db'); // Import the database connection pool
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

/**
 * Controller function to handle new user registration.
 * ... (the registerUser function remains the same as before) ...
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Please provide all required fields: name, email, password, and role." });
        }

        const validRoles = ['student', 'faculty', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role specified. Must be 'student', 'faculty', or 'admin'." });
        }

        const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = { name, email, password: hashedPassword, role };

        const sql = 'INSERT INTO users SET ?';
        const [result] = await db.query(sql, newUser);

        res.status(201).json({ message: "User registered successfully!", userId: result.insertId });

    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

/**
 * Controller function to handle user login.
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
      // Use a generic message for security to not reveal if an email is registered
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
      { expiresIn: '1h' } // Token will expire in 1 hour
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


// Export both functions
module.exports = {
  registerUser,
  loginUser // Add the new login function here
};