const db = require('../config/db'); // Import the database connection pool
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

/**
 * Controller function to handle new user registration.
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
    // A salt is random data added to a password before hashing. 10 is the saltRounds.
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

// Export the function
module.exports = {
  registerUser
};