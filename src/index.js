require('dotenv').config();
const express = require('express');

// DB connection
require('./config/db');

// Route imports
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const reportingRoutes = require('./routes/reportingRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes'); // Import attendance routes

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send('EduTrack Backend is running!');
});

// Use API routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/attendance', attendanceRoutes); // Use attendance routes

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});