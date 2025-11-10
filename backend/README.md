# 🧠 MindNest – Backend (Node.js + Express + Prisma)

MindNest is an incubation and collaboration platform for **students, mentors, and faculty**.  
It merges features inspired by **LinkedIn + GitHub + Startup Incubators**, enabling:

✅ Startup idea submissions  
✅ Student–mentor collaboration  
✅ Team building  
✅ Event & incubation tracking  
✅ 1:1 chat between users  

---

## 📁 Project Folder Structure
## 📁 Project folder structure (backend)

This README lives in the `backend/` folder; below is a concise tree of the backend layout.

```
.
├── config/                # database & server configuration
├── controllers/           # request handlers (controllers)
├── docs/                  # developer docs and API documentation
│   └── api-endpoints.md
├── generated/             # Prisma generated client (auto-generated)
├── middlewares/           # authentication & error middlewares
├── prisma/                # Prisma schema & migrations
│   ├── schema.prisma
│   └── migrations/
├── routes/                # Express route definitions
├── services/              # business logic & DB operations
├── .env                   # environment variables (do NOT commit)
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts
└── server.js              # app entrypoint
```

Notes:
- `generated/` and any Prisma client files are auto-generated; don't edit them manually.
- Keep `.env` out of source control. Use `.env.example` (not present here) to document required variables.

## 🚀 Features

| Feature | Description |
|--------|-------------|
| 🔐 JWT Authentication | Signup / Login / Protected APIs |
| 👤 User Management | View & edit profile details |
| 💬 Chat System | Send messages & fetch message history |
| 🛠 Prisma ORM + PostgreSQL/MySQL | Schema and migrations |
| ⚙️ Modular Clean Architecture | Controllers + Services + Middlewares |

---

## 🔑 API Base URL

http://localhost:3000/api/v1

---

## 🔐 AUTH ROUTES (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/` | Health check (returns "working") | ❌ |
| `POST` | `/signup` | Register new user | ❌ |
| `POST` | `/login` | Login & receive JWT token | ❌ |
| `GET`  | `/users` | Get all users | ❌ *(temporary)* |
| `GET`  | `/user/:id` | Get user details | ✅ |
| `PUT`  | `/user/:id` | Update user info | ✅ |

---

## 💬 CHAT ROUTES (`/chat`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/send` | Send a message | ✅ |
| `GET`  | `/history/:receiverId` | Get chat history between users | ✅ |

### Example Body
```json
POST /chat/send
{
  "receiverId": 2,
  "content": "Hello, how are you?"
}
🧪 Tech Stack
Part	Technology
Backend	Node.js + Express.js
Database	PostgreSQL / MySQL
ORM	Prisma ORM
Auth	JWT (JSON Web Tokens)
Pattern	MVC + Services Layer

⚙️ Setup Instructions
✅ 1. Install dependencies
npm install

✅ 2. Prisma setup
npx prisma generate
npx prisma migrate dev

✅ 3. Start the server
npm run dev

🔑 .env Configuration

Create a .env inside /backend.
Replace <USERNAME> and <PASSWORD> with your DB credentials.

# ------------------------
# SERVER CONFIG
# ------------------------
PORT=3000
NODE_ENV=development

# ------------------------
# DATABASE (Prisma)
# Replace <USERNAME> and <PASSWORD>
# ------------------------
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/mindnest_db"
# OR (If using MySQL)
# DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@localhost:3306/mindnest"

# ------------------------
# JWT CONFIG
# ------------------------
JWT_SECRET="your_super_strong_secret_key"
JWT_EXPIRES_IN=7d

# ------------------------
# CORS CONFIG
# ------------------------
FRONTEND_URL=http://localhost:5173