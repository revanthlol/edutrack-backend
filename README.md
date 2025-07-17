# EduTrack - Student Management System API

EduTrack is a comprehensive and robust backend system designed for educational institutions to digitize and manage student records, course enrollments, grades, and attendance efficiently. The system features role-based access control, ensuring secure interactions for administrators, faculty, and students.

## Key Features

-   **Secure User Management**: JWT-based authentication with password hashing (bcryptjs).
-   **Role-Based Access Control (RBAC)**: Differentiated permissions for Admins, Faculty, and Students.
-   **Full Course Management**: Complete CRUD (Create, Read, Update, Delete) operations for courses.
-   **Student Enrollment System**: Allows students to enroll in courses and faculty to manage rosters.
-   **Academic Management**: Enables grade entry and attendance tracking with date/time stamps.
-   **Reporting & Analytics**: Generate detailed performance reports for individual students and entire classes.
-   **Data Export**: Course performance reports can be exported to JSON (default) or CSV formats.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MySQL
-   **Authentication**: JSON Web Tokens (JWT)
-   **Password Hashing**: Bcrypt.js
-   **Data Export**: json2csv

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v14 or higher)
-   [MySQL](https://www.mysql.com/downloads/) (or a compatible tool like XAMPP, MAMP)
-   [Git](https://git-scm.com/)
-   An API client like [Postman](https://www.postman.com/) or the Thunder Client VS Code extension.

### Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-github-repository-url>
    cd edutrack-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the Database:**
    -   Make sure your MySQL server is running.
    -   Using a MySQL client (e.g., phpMyAdmin, MySQL Workbench), create a new database:
        ```sql
        CREATE DATABASE edutrack_db;
        ```

4.  **Configure Environment Variables:**
    -   Create a `.env` file in the root of the project by duplicating the `.env.example` file (if provided) or creating a new one.
    -   Add the following configuration:
        ```
        PORT=3000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=edutrack_db
        JWT_SECRET=your-very-secret-and-long-key
        ```
        *Replace `DB_USER` and `DB_PASSWORD` with your MySQL credentials.*

5.  **Run Database Migrations:**
    -   Import and run the SQL scripts from the `database/migrations/` folder in the correct numerical order (`001`, `002`, `003`, etc.) against your `edutrack_db` database.

6.  **Start the Server:**
    ```bash
    npm start
    ```
    The API will be running at `http://localhost:3000`.

---

## API Endpoints

Below is a detailed list of the available API endpoints.

### User Management (`/api/users`)

| Method | Endpoint         | Description                   | Access    | Body Fields                           |
| :----- | :--------------- | :---------------------------- | :-------- | :------------------------------------ |
| `POST` | `/register`      | Register a new user.          | Public    | `name`, `email`, `password`, `role`   |
| `POST` | `/login`         | Log in a user to get a token. | Public    | `email`, `password`                   |
| `GET`  | `/profile`       | Get the logged-in user's profile. | Private   | -                                     |

### Course Management (`/api/courses`)

| Method   | Endpoint | Description                   | Access             |
| :------- | :------- | :---------------------------- | :----------------- |
| `GET`    | `/`      | Get a list of all courses.    | Public             |
| `POST`   | `/`      | Create a new course.          | Admin, Faculty     |
| `GET`    | `/:id`   | Get details for a single course. | Public             |
| `PUT`    | `/:id`   | Update a course's details.    | Admin, Faculty     |
| `DELETE` | `/:id`   | Delete a course.              | Admin              |

### Enrollment Management (`/api/enrollments`)

| Method | Endpoint           | Description                                  | Access         |
| :----- | :----------------- | :------------------------------------------- | :------------- |
| `POST` | `/`                | Enroll logged-in student in a course.        | Student        |
| `GET`  | `/my-courses`      | Get courses the logged-in student is enrolled in. | Student        |
| `GET`  | `/course/:courseId`| Get all students enrolled in a specific course. | Admin, Faculty |
| `PUT`  | `/grade`           | Assign a grade to a student for a course.     | Admin, Faculty |

### Attendance Management (`/api/attendance`)

| Method | Endpoint           | Description                           | Access         |
| :----- | :----------------- | :------------------------------------ | :------------- |
| `POST` | `/`                | Mark student attendance for a course. | Admin, Faculty |
| `GET`  | `/course/:courseId`| Get attendance report for a course.   | Admin, Faculty |

### Reporting (`/api/reports`)

| Method | Endpoint                | Description                            | Access         |
| :----- | :---------------------- | :------------------------------------- | :------------- |
| `GET`  | `/student/:studentId`   | Get a performance report for a student. | Admin, Faculty |
| `GET`  | `/course/:courseId`     | Get performance report for a course. (`?format=csv` for CSV export) | Admin, Faculty |

---

## Final Project Submission
This repository fulfills the backend requirements. As requested, a plan for a frontend application can now be discussed. For a complete submission according to the PDF, a Postman collection and a demo video walkthrough would be the next steps.
