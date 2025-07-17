const express = require('express');
const router = express.Router();

const { 
    enrollInCourse, 
    getCourseEnrollments,
    getMyEnrollments,
    assignGrade // Import the new function
} = require('../controllers/enrollmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// STUDENT ROUTES
router.post('/', protect, authorize('student'), enrollInCourse);
router.get('/my-courses', protect, authorize('student'), getMyEnrollments);


// ADMIN / FACULTY ROUTES
router.get('/course/:courseId', protect, authorize('admin', 'faculty'), getCourseEnrollments);
router.put('/grade', protect, authorize('admin', 'faculty'), assignGrade);


module.exports = router;