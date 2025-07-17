const db = require('../config/db');

/**
 * @desc    Enroll the logged-in student in a course
 * @route   POST /api/enrollments/
 * @access  Private (Student)
 */
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }

    // Optional but good practice: Check if the course exists
    const [course] = await db.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (course.length === 0) {
        return res.status(404).json({ message: 'Course not found.' });
    }

    const newEnrollment = {
      student_id: studentId,
      course_id: courseId
    };

    const sql = 'INSERT INTO enrollments SET ?';
    await db.query(sql, newEnrollment);

    res.status(201).json({ message: `Successfully enrolled in course ${courseId}.` });
  } catch (error) {
    // Handle the unique constraint violation
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'You are already enrolled in this course.' });
    }
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Get all students enrolled in a specific course
 * @route   GET /api/enrollments/course/:courseId
 * @access  Private (Admin, Faculty)
 */
const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const sql = `
        SELECT u.id, u.name, u.email, e.enrollment_date, e.grade 
        FROM enrollments e
        JOIN users u ON e.student_id = u.id
        WHERE e.course_id = ?
    `;
    const [enrollments] = await db.query(sql, [courseId]);

    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching course enrollments:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Get all courses a student is enrolled in
 * @route   GET /api/enrollments/my-courses
 * @access  Private (Student)
 */
const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const sql = `
        SELECT c.id, c.course_code, c.name, e.enrollment_date, e.grade
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ?
    `;
    const [courses] = await db.query(sql, [studentId]);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching student's enrollments:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  enrollInCourse,
  getCourseEnrollments,
  getMyEnrollments // Don't forget to export the new function
};