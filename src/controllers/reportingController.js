const db = require('../config/db');

/**
 * @desc    Generate a performance report for an individual student
 * @route   GET /api/reports/student/:studentId
 * @access  Private (Admin, Faculty)
 */
const getStudentPerformanceReport = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Step 1: Get the student's basic information
        const studentSql = 'SELECT id, name, email FROM users WHERE id = ? AND role = "student"';
        const [students] = await db.query(studentSql, [studentId]);

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Step 2: Get all the courses and grades for that student
        const coursesSql = `
            SELECT c.course_code, c.name, e.grade, e.enrollment_date
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ?
        `;
        const [courses] = await db.query(coursesSql, [studentId]);
        
        // Step 3: Combine into a single report object
        const report = {
            student: students[0],
            courses
        };

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
        
        // Step 1: Get course details
        const courseSql = 'SELECT id, course_code, name FROM courses WHERE id = ?';
        const [courses] = await db.query(courseSql, [courseId]);

        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Step 2: Get all enrolled students and their grades for this course
        const enrollmentsSql = `
            SELECT u.id AS student_id, u.name, u.email, e.grade
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            WHERE e.course_id = ? AND u.role = 'student'
            ORDER BY u.name
        `;
        const [enrollments] = await db.query(enrollmentsSql, [courseId]);

        // Step 3: Combine into a single report object
        const report = {
            course: courses[0],
            students: enrollments
        };
        
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
