/**
 * @desc    Enroll the logged-in student in a course
 * @route   POST /api/enrollments/
 * @access  Private (Student)
 */
const enrollInCourse = async (req, res) => {
    res.json({ 
        message: "Student enrollment endpoint hit!",
        studentId: req.user.id, // Logged-in user from protect middleware
        courseId: req.body.courseId // From the request body
    });
};

/**
 * @desc    Get all students enrolled in a specific course
 * @route   GET /api/enrollments/course/:courseId
 * @access  Private (Admin, Faculty)
 */
const getCourseEnrollments = async (req, res) => {
    res.json({
        message: "Get course enrollments endpoint hit!",
        courseId: req.params.courseId
    });
};

module.exports = {
    enrollInCourse,
    getCourseEnrollments
};