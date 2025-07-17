const express = require('express');
const router = express.Router();

const { 
    enrollInCourse, 
    getCourseEnrollments
} = require('../controllers/enrollmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/enrollments
// @desc    A logged-in student can enroll themselves in a course
router.post('/', protect, authorize('student'), enrollInCourse);

// @route   GET /api/enrollments/course/:courseId
// @desc    An admin or faculty member can see all students in a course
router.get('/course/:courseId', protect, authorize('admin', 'faculty'), getCourseEnrollments);


module.exports = router;