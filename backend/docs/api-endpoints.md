# 🚀 MindNest API Endpoints

Base URL: `http://localhost:3000/api/v1`

---

## 🔐 Auth Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|-----------|-------------|----------------|
| **GET** | `/` | Health check (returns "working") | ❌ |
| **POST** | `/signup` | Register a new user | ❌ |
| **POST** | `/login` | Log in and receive a JWT token | ❌ |
| **GET** | `/users` | Get all users | ❌ *(currently public)* |
| **GET** | `/user/:id` | Get specific user details | ✅ JWT required |
| **PUT** | `/user/:id` | Update user info | ✅ JWT required |

---

## 🔑 Example `.env` File



---
