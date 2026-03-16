# 🎓 Intern Tracker — Backend API

A simple Node.js + Express + MongoDB backend to manage intern profiles, tasks, and weekly progress.

---

## 📁 Project Structure

```
intern-tracker/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, Me
│   ├── internController.js    # CRUD for intern profiles
│   ├── taskController.js      # CRUD for tasks
│   └── progressController.js  # CRUD for weekly progress
├── middleware/
│   └── authMiddleware.js      # JWT auth + role guard
├── models/
│   ├── User.js                # Admin & Intern schema
│   ├── Task.js                # Task schema
│   └── Progress.js            # Weekly progress schema
├── routes/
│   ├── authRoutes.js
│   ├── internRoutes.js
│   ├── taskRoutes.js
│   └── progressRoutes.js
├── .env.example
├── package.json
└── server.js
```

---

## ⚙️ Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```
Edit `.env` and set your `MONGO_URI` and `JWT_SECRET`.

### 3. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔐 Authentication

All protected routes require a **Bearer Token** in the header:
```
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint            | Access | Description             |
|--------|---------------------|--------|-------------------------|
| POST   | /api/auth/register  | Public | Register admin or intern|
| POST   | /api/auth/login     | Public | Login and get token     |
| GET    | /api/auth/me        | Private| Get logged-in user info |

**Register Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "admin",
  "department": "Engineering"
}
```

**Login Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

### Interns (Admin only)
| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | /api/interns      | Get all interns      |
| GET    | /api/interns/:id  | Get one intern       |
| PUT    | /api/interns/:id  | Update intern info   |
| DELETE | /api/interns/:id  | Delete intern        |

> To onboard an intern, use **POST /api/auth/register** with `"role": "intern"`.

---

### Tasks
| Method | Endpoint        | Access       | Description                       |
|--------|-----------------|--------------|-----------------------------------|
| POST   | /api/tasks      | Admin        | Create and assign a task          |
| GET    | /api/tasks      | Both         | Admin sees all, intern sees own   |
| GET    | /api/tasks/:id  | Both         | View single task                  |
| PUT    | /api/tasks/:id  | Both         | Admin edits; intern submits work  |
| DELETE | /api/tasks/:id  | Admin        | Delete a task                     |

**Create Task Body (Admin):**
```json
{
  "title": "Build Login Page",
  "description": "Create a responsive login form",
  "assignedTo": "<intern_user_id>",
  "deadline": "2025-08-01",
  "priority": "high"
}
```

**Submit Task Body (Intern):**
```json
{
  "submissionLink": "https://github.com/yourrepo",
  "submissionNote": "Done! Added input validation too."
}
```

**Update Task (Admin — give feedback):**
```json
{
  "status": "completed",
  "adminFeedback": "Great work! Clean code."
}
```

---

### Progress
| Method | Endpoint                        | Access | Description                   |
|--------|---------------------------------|--------|-------------------------------|
| POST   | /api/progress                   | Admin  | Add weekly progress record    |
| GET    | /api/progress                   | Both   | Admin sees all, intern own    |
| GET    | /api/progress/intern/:internId  | Admin  | All progress for one intern   |
| PUT    | /api/progress/:id               | Admin  | Update a record               |
| DELETE | /api/progress/:id               | Admin  | Delete a record               |

**Add Progress Body:**
```json
{
  "intern": "<intern_user_id>",
  "week": 3,
  "totalTasks": 5,
  "completedTasks": 4,
  "score": 85,
  "adminNote": "Good progress, needs to improve communication."
}
```

---

## 🧪 Test with Postman

1. Register an admin → copy the token
2. Use token to register interns
3. Assign tasks to interns
4. Login as intern → submit tasks
5. Admin gives feedback + records progress

---

## 🛠️ Tech Stack

- **Node.js** — Runtime
- **Express.js** — Web framework
- **MongoDB** — Database
- **Mongoose** — ODM
- **JWT** — Authentication
- **bcryptjs** — Password hashing
