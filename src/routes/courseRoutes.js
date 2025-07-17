const express = require('express');
const router = express.Router();

const { createCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Define the route for creating a new course.
// POST /api/courses
// The request first goes through 'protect', then 'authorize', then 'createCourse'.
// Only users with the role 'admin' or 'faculty' will be allowed.
router.post('/', protect, authorize('admin', 'faculty'), createCourse);

module.exports = router;