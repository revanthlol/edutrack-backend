/**
 * Controller function to create a new course.
 * Accessible only by 'admin' and 'faculty'.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createCourse = async (req, res) => {
    // The actual logic for creating a course will be added in the next step.
    res.status(201).json({ 
        message: "Course creation endpoint hit successfully!",
        // The user who made the request is available from our middleware
        createdBy: req.user 
    });
};

module.exports = {
    createCourse
};