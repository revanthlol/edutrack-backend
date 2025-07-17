const db = require('../config/db');
const { Parser } = require('json2csv'); // Import the json2csv Parser

/**
 * @desc    Generate a performance report for an individual student
... (getStudentPerformanceReport function remains the same) ...
 */
const getStudentPerformanceReport = async (req, res) => {
    // ... no changes here ...
    try {
        const { studentId } = req.params;
        const studentSql = 'SELECT id, name, email FROM users WHERE id = ? AND role = "student"';
        const [students] = await db.query(studentSql, [studentId]);
        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        const coursesSql = `SELECT c.course_code, c.name, e.grade, e.enrollment_date FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?`;
        const [courses] = await db.query(coursesSql, [studentId]);
        const report = { student: students[0], courses };
        res.json(report);
    } catch (error) {
        console.error("Error generating student performance report:", error);
        res.status(500).json({ message: "Server error." });
    }
};

/**
 * @desc    Generate a performance report for an entire class (course)
 * @route   GET /api/reports/course/:courseId
 * @access  Private (Admin, Faculty)
 */
const getCoursePerformanceReport = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { format } = req.query; // Check for format=csv

        // Step 1 & 2: Get course and enrollment data (same as before)
        const courseSql = 'SELECT id, course_code, name FROM courses WHERE id = ?';
        const [courses] = await db.query(courseSql, [courseId]);
        if (courses.length === 0) return res.status(404).json({ message: 'Course not found.' });
        
        const enrollmentsSql = `SELECT u.id AS student_id, u.name, u.email, e.grade FROM enrollments e JOIN users u ON e.student_id = u.id WHERE e.course_id = ? AND u.role = 'student' ORDER BY u.name`;
        const [enrollments] = await db.query(enrollmentsSql, [courseId]);

        // Step 3: Handle the response format
        if (format && format.toLowerCase() === 'csv') {
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(enrollments);
            res.header('Content-Type', 'text/csv');
            res.attachment(`course-${courseId}-report.csv`);
            return res.send(csv);
        }

        // Default to JSON if format is not csv
        const report = { course: courses[0], students: enrollments };
        res.json(report);

    } catch (error) {
        console.error("Error generating course performance report:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    getStudentPerformanceReport,
    getCoursePerformanceReport
};
