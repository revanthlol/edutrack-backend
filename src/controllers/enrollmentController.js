const db = require('../config/db');

// ... (enrollInCourse, getCourseEnrollments, getMyEnrollments functions remain the same) ...

const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id;
        if (!courseId) return res.status(400).json({ message: 'Course ID is required.' });

        const [course] = await db.query('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (course.length === 0) return res.status(404).json({ message: 'Course not found.' });
        
        const newEnrollment = { student_id: studentId, course_id: courseId };
        const sql = 'INSERT INTO enrollments SET ?';
        await db.query(sql, newEnrollment);

        res.status(201).json({ message: `Successfully enrolled in course ${courseId}.` });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'You are already enrolled in this course.' });
        console.error("Error enrolling in course:", error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const getCourseEnrollments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const sql = `
            SELECT u.id, u.name, u.email, e.enrollment_date, e.grade 
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            WHERE e.course_id = ?`;
        const [enrollments] = await db.query(sql, [courseId]);
        res.json(enrollments);
    } catch (error) {
        console.error("Error fetching course enrollments:", error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const getMyEnrollments = async (req, res) => {
    try {
        const studentId = req.user.id;
        const sql = `
            SELECT c.id, c.course_code, c.name, e.enrollment_date, e.grade
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ?`;
        const [courses] = await db.query(sql, [studentId]);
        res.json(courses);
    } catch (error) {
        console.error("Error fetching student's enrollments:", error);
        res.status(500).json({ message: 'Server error.' });
    }
};


/**
 * @desc    Assign or update a grade for a student in a course
 * @route   PUT /api/enrollments/grade
 * @access  Private (Admin, Faculty)
 */
const assignGrade = async (req, res) => {
  try {
    const { studentId, courseId, grade } = req.body;

    // 1. Validate input
    if (!studentId || !courseId || !grade) {
      return res.status(400).json({ message: 'Student ID, Course ID, and Grade are all required.' });
    }
    
    // Simple validation for grade format
    const allowedGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
    if (!allowedGrades.includes(grade.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid grade format.' });
    }

    // 2. Check if the enrollment actually exists
    const findEnrollmentSql = 'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?';
    const [enrollments] = await db.query(findEnrollmentSql, [studentId, courseId]);

    if (enrollments.length === 0) {
      return res.status(404).json({ message: 'Enrollment record not found for this student and course.' });
    }
    
    // 3. Update the grade for that enrollment record
    const updateSql = 'UPDATE enrollments SET grade = ? WHERE student_id = ? AND course_id = ?';
    await db.query(updateSql, [grade.toUpperCase(), studentId, courseId]);
    
    res.json({ message: 'Grade assigned successfully.' });

  } catch (error) {
    console.error("Error assigning grade:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};


module.exports = {
  enrollInCourse,
  getCourseEnrollments,
  getMyEnrollments,
  assignGrade // Export the new function
};