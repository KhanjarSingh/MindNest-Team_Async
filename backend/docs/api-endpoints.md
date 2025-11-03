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

## 💬 Chat Routes (`/chat`)

| Method | Endpoint | Description | Auth Required |
|--------|-----------|-------------|----------------|
| **POST** | `/send` | Send a message to another user | ✅ JWT required |
| **GET** | `/history/:receiverId` | Get chat history with specific user | ✅ JWT required |

### Request Examples:

#### Send Message
```json
POST /chat/send
{
    "receiverId": 2,
    "content": "Hello, how are you?"
}
```

#### Get Chat History
```
GET /chat/history/2
```
Returns chat history between authenticated user and user with ID 2

---

## 🔑 Example `.env` File



---
