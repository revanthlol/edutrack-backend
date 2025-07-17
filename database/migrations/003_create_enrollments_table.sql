-- This script creates the 'enrollments' junction table to link students and courses.

CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `grade` VARCHAR(2) DEFAULT NULL, -- e.g., 'A+', 'B', 'C-' etc.

    -- Foreign key constraints to ensure data integrity
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,

    -- A student can only enroll in the same course once
    UNIQUE KEY `unique_enrollment` (`student_id`, `course_id`)
);