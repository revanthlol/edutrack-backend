const express = require('express');
const router = express.Router();

const {
    markAttendance,
    getAttendanceReport
} = require('../controllers/attendanceController');

const { protect, authorize } = require('../middleware/authMiddleware');

// @desc   Mark or update student attendance for a course on a given day
// @route  POST /api/attendance
router.post('/', protect, authorize('admin', 'faculty'), markAttendance);

// @desc   Get attendance report for a course, with filtering
// @route  GET /api/attendance/course/:courseId
router.get('/course/:courseId', protect, authorize('admin', 'faculty'), getAttendanceReport);

module.exports = router;