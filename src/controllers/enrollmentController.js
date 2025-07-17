const express = require('express');
const router = express.Router();

const { 
    enrollInCourse, 
    getCourseEnrollments,
    getMyEnrollments // Import the new function
} = require('../controllers/enrollmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/enrollments
// @desc    A logged-in student can enroll themselves in a course
router.post('/', protect, authorize('student'), enrollInCourse);

// @route   GET /api/enrollments/my-courses
// @desc    A logged-in student can see their own list of courses
router.get('/my-courses', protect, authorize('student'), getMyEnrollments);

// @route   GET /api/enrollments/course/:courseId
// @desc    An admin or faculty member can see all students in a course
router.get('/course/:courseId', protect, authorize('admin', 'faculty'), getCourseEnrollments);


module.exports = router;