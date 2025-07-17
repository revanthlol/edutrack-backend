const db = require('../config/db');

/**
 * @desc    Mark attendance for a student
 * @route   POST /api/attendance
 * @access  Private (Admin, Faculty)
 */
const markAttendance = async (req, res) => {
    try {
        const { studentId, courseId, status, date } = req.body;

        if (!studentId || !courseId || !status || !date) {
            return res.status(400).json({ message: 'studentId, courseId, status, and date are required.' });
        }
        
        // Step 1: Verify the student is enrolled in the course
        const enrollSql = 'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?';
        const [enrollment] = await db.query(enrollSql, [studentId, courseId]);

        if (enrollment.length === 0) {
            return res.status(404).json({ message: 'Cannot mark attendance. Student is not enrolled in this course.' });
        }

        // Step 2: Insert or Update attendance record (Upsert)
        // This query will insert a new record, but if a record already exists 
        // for that unique key (student, course, date), it will update the status instead.
        const attendanceSql = `
            INSERT INTO attendance (student_id, course_id, attendance_date, status)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE status = ?
        `;
        await db.query(attendanceSql, [studentId, courseId, date, status, status]);

        res.status(201).json({ message: 'Attendance marked successfully.' });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Server error." });
    }
};

/**
 * @desc    Get attendance report for a course, with optional date filtering
 * @route   GET /api/attendance/course/:courseId
 * @access  Private (Admin, Faculty)
 */
const getAttendanceReport = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { date } = req.query; // For filtering, e.g., /api/attendance/course/1?date=2025-06-16

        let sql = `
            SELECT a.id, a.attendance_date, a.status, u.name as student_name, u.email
            FROM attendance a
            JOIN users u ON a.student_id = u.id
            WHERE a.course_id = ?
        `;
        const params = [courseId];

        // If a date query parameter is provided, add it to the query
        if (date) {
            sql += ' AND a.attendance_date = ?';
            params.push(date);
        }

        sql += ' ORDER BY a.attendance_date DESC, u.name ASC';

        const [report] = await db.query(sql, params);

        res.json(report);
    } catch (error) {
        console.error("Error generating attendance report:", error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    markAttendance,
    getAttendanceReport
};