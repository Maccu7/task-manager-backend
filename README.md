# Task Manager Backend

This is the backend API for the Task Manager application. It is built with Node.js and Express, providing RESTful endpoints for user authentication and task management.

## Features

- User registration and authentication (JWT-based)
- CRUD operations for tasks
- Input validation
- Environment variable support via `.env`
- Modular structure (routes, models, middleware, validators)

## Project Structure

```
task_manager_backend/
├── .env
├── db.js
├── index.js
├── package.json
├── middleware/
│   ├── auth.js
│   └── validate.js
├── models/
│   ├── task.js
│   └── user.js
├── routes/
│   ├── auth.js
│   └── tasks.js
└── validators/
    ├── auth.validator.js
    └── task.validator.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
    ```powershell
    git clone https://github.com/Maccu7/flutter-task-manager.git
    cd flutter-task-manager/task_manager_backend
    ```

2. Install dependencies:
    ```powershell
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables (e.g., database connection string, JWT secret).

### Running the Server

```powershell
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT

### Tasks

- `GET /api/tasks` — Get all tasks (authenticated)
- `POST /api/tasks` — Create a new task (authenticated)
- `PUT /api/tasks/:id` — Update a task (authenticated)
- `DELETE /api/tasks/:id` — Delete a task (authenticated)

## Environment Variables

Example `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_jwt_secret
```

## License

This project is licensed under the MIT License.
