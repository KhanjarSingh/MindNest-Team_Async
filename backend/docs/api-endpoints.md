# 🚀 MindNest API Endpoints

Base URL: `http://localhost:3000/api/v1`

---

## 🔐 Auth Routes (`/auth`)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/auth/` | Health check |
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in user and return JWT |
| GET | `/auth/user` | Get all users |
| GET | `/auth/user/:id` | Get user by ID |
| PUT | `/auth/user/:id` | Update user details |
