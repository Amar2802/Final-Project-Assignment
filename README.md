# Task Management System

A basic MERN Stack CRUD application built for the final assessment. Users can create tasks, view all tasks, update task status, delete tasks, and filter by status.

## Features

- Create tasks with title and description
- View all saved tasks
- Mark tasks as Pending or Completed
- Delete tasks from the UI and database
- Filter tasks by All, Pending, or Completed
- Basic validation for empty fields
- Clean folder structure with separate frontend and backend

## Tech Stack

- Frontend: React with functional components and hooks
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- API: REST endpoints using GET, POST, PUT, and DELETE
- Styling: Basic CSS

## Project Structure

```text
project-root/
|-- backend/
|   |-- config/db.js
|   |-- controllers/taskController.js
|   |-- models/Task.js
|   |-- routes/taskRoutes.js
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- public/index.html
|   |-- src/
|   |   |-- components/TaskForm.js
|   |   |-- components/TaskList.js
|   |   |-- services/api.js
|   |   |-- App.js
|   |   |-- index.js
|   |   `-- styles.css
|   `-- package.json
`-- README.md
```

## Setup Instructions

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create `backend/.env` from `backend/.env.example` and set your MongoDB URI:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-management-system
```

3. Start the backend server:

```bash
npm start
```

4. Install frontend dependencies in a second terminal:

```bash
cd frontend
npm install
```

5. Create `frontend/.env` from `frontend/.env.example` if your backend URL is different:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

6. Start the React frontend:

```bash
npm start
```

The frontend runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

## Screenshots

Run the app locally and add screenshots of:

- Task creation form
- Task list with pending and completed tasks
- Filtered completed or pending task view

## Submission Notes

- Do not commit `node_modules`
- Do not commit `.env`
- Keep the repository public for GitHub submission
