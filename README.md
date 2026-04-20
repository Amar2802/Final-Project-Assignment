Frontend-<img width="1354" height="716" alt="Screenshot 2026-04-20 125715" src="https://github.com/user-attachments/assets/f9aae061-1751-4ae1-af0a-7353a23e5039" />

Database-<img width="1328" height="656" alt="Screenshot 2026-04-20 131312" src="https://github.com/user-attachments/assets/df3fe84a-877d-4924-bf62-e039975273cb" />

# Task Management System (MERN)

This is a simple Task Management application built using the MERN stack. The main goal of this project is to understand how frontend, backend, and database work together using APIs.

## Features

* Add new tasks
* View all tasks
* Update task status (Pending / Completed)
* Delete tasks

## Tech Stack

* Frontend: React
* Backend: Node.js, Express
* Database: MongoDB

## Project Structure

backend/ → API, database, server
frontend/ → React UI

## API Endpoints

* GET /api/tasks → get all tasks
* POST /api/tasks → create task
* PUT /api/tasks/:id → update task
* DELETE /api/tasks/:id → delete task

## How to Run

### Backend

cd backend
npm install
node server.js

### Frontend

cd frontend
npm install
npm start

## Notes

* MongoDB connection is stored in `.env`
* Basic CRUD operations are implemented
* No authentication is used in this project
