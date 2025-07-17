const db = require('../config/db');

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (Admin, Faculty)
 */
const createCourse = async (req, res) => {
  try {
    const { course_code, name, description } = req.body;
    
    // Basic validation
    if (!course_code || !name) {
      return res.status(400).json({ message: 'Course code and name are required.' });
    }

    // Get the user ID from the middleware
    const created_by = req.user.id;

    const newCourse = { course_code, name, description, created_by };
    
    const sql = 'INSERT INTO courses SET ?';
    const [result] = await db.query(sql, newCourse);

    res.status(201).json({ message: 'Course created successfully', courseId: result.insertId });
  } catch (error) {
    // Handle potential duplicate entry for course_code
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A course with this code already exists.' });
    }
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
const getAllCourses = async (req, res) => {
  try {
    const sql = 'SELECT id, course_code, name, description FROM courses ORDER BY created_at DESC';
    const [courses] = await db.query(sql);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Get a single course by its ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT id, course_code, name, description FROM courses WHERE id = ?';
    const [courses] = await db.query(sql, [id]);

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.json(courses[0]);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Update a course
 * @route   PUT /api/courses/:id
 * @access  Private (Admin, Faculty)
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if course exists first
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Build the fields to update
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (description) fieldsToUpdate.description = description;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const sql = 'UPDATE courses SET ? WHERE id = ?';
    await db.query(sql, [fieldsToUpdate, id]);

    res.json({ message: 'Course updated successfully.' });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private (Admin)
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the course exists
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const sql = 'DELETE FROM courses WHERE id = ?';
    await db.query(sql, [id]);

    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error." });
  }
};


module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};