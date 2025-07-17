-- This script populates the database with sample data.
-- Make sure to run the migration scripts first to create the tables.

-- Step 1: Create Departments
INSERT INTO `departments` (`name`) VALUES
('Computer Science'),
('History'),
('Mathematics');

-- Step 2: Create Users (Admin, Faculty, Students)
-- Passwords for all users are 'password123'
INSERT INTO `users` (`name`, `email`, `password`, `role`, `department_id`) VALUES
('Admin User', 'admin@edutrack.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'admin', NULL),
('Prof. Alan Turing', 'alan.turing@edutrack.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'faculty', 1),
('Prof. Ada Lovelace', 'ada.lovelace@edutrack.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'faculty', 1),
('Prof. Will Durant', 'will.durant@edutrack.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'faculty', 2),
('Charlie Student', 'charlie@student.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'student', NULL),
('Bob Student', 'bob@student.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'student', NULL),
('Alice Student', 'alice@student.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'student', NULL),
('David Student', 'david@student.com', '$2a$10$w0B1/A1tT06x.AKfzXMMd.GVauXuT7.Q2xJgU.WVA9/o5uSscX2R2', 'student', NULL);

-- Step 3: Create Courses
-- created_by refers to the faculty users (IDs 2, 3, 4)
INSERT INTO `courses` (`course_code`, `name`, `description`, `created_by`) VALUES
('CS101', 'Introduction to Programming', 'A beginner-friendly course on programming fundamentals using Python.', 2),
('CS303', 'Data Structures and Algorithms', 'An in-depth look at fundamental data structures.', 3),
('HIST202', 'The Story of Civilization', 'A survey of world history from ancient times to the Renaissance.', 4),
('MATH101', 'Calculus I', 'An introduction to differential calculus.', 2);

-- Step 4: Create Enrollments
-- student_id refers to student users (IDs 5, 6, 7, 8)
-- course_id refers to course IDs (1, 2, 3, 4)
INSERT INTO `enrollments` (`student_id`, `course_id`, `grade`) VALUES
-- Charlie's enrollments
(5, 1, 'A-'),
(5, 3, 'B+'),
-- Bob's enrollments
(6, 1, 'B'),
(6, 4, 'A'),
-- Alice's enrollments
(7, 2, 'A'),
(7, 3, 'A-'),
(7, 4, 'B'),
-- David's enrollments
(8, 1, 'C+');

-- Step 5: Create Attendance Records
-- student_id, course_id, attendance_date, status
INSERT INTO `attendance` (`student_id`, `course_id`, `attendance_date`, `status`) VALUES
-- CS101 Attendance
(5, 1, '2025-06-15', 'present'),
(6, 1, '2025-06-15', 'present'),
(8, 1, '2025-06-15', 'absent'),
(5, 1, '2025-06-16', 'present'),
(6, 1, '2025-06-16', 'late'),
(8, 1, '2025-06-16', 'present'),
-- HIST202 Attendance
(5, 3, '2025-06-17', 'present'),
(7, 3, '2025-06-17', 'excused');