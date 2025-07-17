ALTER TABLE `users` ADD COLUMN `department_id` INT NULL;
ALTER TABLE `users` ADD FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL;