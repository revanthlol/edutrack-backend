const express = require('express');
const router = express.Router();

const {
    getStudentPerformanceReport,
    getCoursePerformanceReport
} = require('../controllers/reportingController');

const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/reports/student/:studentId
// @desc    Get a performance report for a single student
// @access  Private (Admin, Faculty)
router.get(
    '/student/:studentId',
    protect,
    authorize('admin', 'faculty'),
    getStudentPerformanceReport
);

// @route   GET /api/reports/course/:courseId
// @desc    Get a performance report for a whole class
// @access  Private (Admin, Faculty)
router.get(
    '/course/:courseId',
    protect,
    authorize('admin', 'faculty'),
    getCoursePerformanceReport
);


module.exports = router;