# UpRise Backend

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or remote instance)

## Installation

```bash
npm install
```

## Database Setup

1. Make sure MongoDB is running on your system
2. Set up environment variables (optional):
   - Create a `.env` file in the backend directory
   - Add `MONGODB_URI=your_mongodb_connection_string` (if using remote MongoDB)
   - Add `JWT_SECRET=your_jwt_secret_key` (for authentication)
   - Add `PORT=5000` (or your preferred port)

3. Seed the database with initial data:
```bash
npm run seed
```

This will create:
- An admin user (email: admin@uprise.com, password: admin123)
- A sample student user (email: student@uprise.com, password: student123)

## Running the Application

```bash
npm run dev
```

The server will start on port 5000 by default (http://localhost:5000).

## API Endpoints

### Authentication
- POST `/api/v1/register` - Register a new student
- POST `/api/v1/login` - Student login
- POST `/api/v1/admin/login` - Admin login

### Student Routes
- GET `/api/v1/courses` - Get all courses
- GET `/api/v1/courses/:id` - Get course by ID
- GET `/api/v1/categories` - Get all categories

### Admin Routes
- GET `/api/v1/admin/dashboard` - Get dashboard statistics
- GET `/api/v1/admin/users` - Get all users
- DELETE `/api/v1/admin/users/:id` - Delete a user
- GET `/api/v1/admin/categories` - Get all categories
- POST `/api/v1/admin/categories` - Create a new category
- PUT `/api/v1/admin/categories/:id` - Update a category
- DELETE `/api/v1/admin/categories/:id` - Delete a category