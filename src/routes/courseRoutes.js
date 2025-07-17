const express = require('express');
const router = express.Router();

const { 
  createCourse, 
  getAllCourses, 
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route for getting all courses (public) and creating a new course (protected)
router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('admin', 'faculty'), createCourse);

// Route for single course operations (get, update, delete)
router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('admin', 'faculty'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;