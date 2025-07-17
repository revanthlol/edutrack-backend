// Import the mysql2 library
const mysql = require('mysql2');

// We no longer need dotenv here as it's loaded first in index.js

// Create a connection pool, which is more efficient than a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Wait for a connection to be available if all are in use
  connectionLimit: 10,     // Max number of connections in the pool
  queueLimit: 0            // No limit on the number of waiting connection requests
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  } else {
    console.log('Successfully connected to the database.');
    // Release the connection back to the pool
    connection.release();
  }
});

// Export the pool with promise support for use in other parts of the application
module.exports = pool.promise();