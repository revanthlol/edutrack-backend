    -- This script creates the 'users' table in the 'edutrack_db' database.

    CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `role` ENUM('student', 'faculty', 'admin') NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );