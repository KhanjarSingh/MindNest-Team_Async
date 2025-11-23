# System Architecture - Role-Based Authentication

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MINDNEST SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐          ┌──────────────────────────┐ │
│  │   FRONTEND (React)  │          │   BACKEND (Node.js)      │ │
│  │   Port: 3000        │◄────────►│   Port: 3002             │ │
│  │                     │   HTTP   │                          │ │
│  │  ┌────────────────┐ │  (JSON)  │ ┌────────────────────┐  │ │
│  │  │   Vite Dev     │ │          │ │  Express Server    │  │ │
│  │  │   Server       │ │          │ │  ├─ Auth Routes    │  │ │
│  │  └────────────────┘ │          │ │  ├─ Services       │  │ │
│  │                     │          │ │  └─ Controllers    │  │ │
│  │  ┌────────────────┐ │          │ └────────────────────┘  │ │
│  │  │   Components   │ │          │                          │ │
│  │  │  ├─ SignUp     │ │          │ ┌────────────────────┐  │ │
│  │  │  ├─ SignIn     │ │          │ │  Prisma ORM        │  │ │
│  │  │  └─ Dashboards │ │          │ │  ├─ Schema         │  │ │
│  │  └────────────────┘ │          │ │  ├─ Migrations     │  │ │
│  │                     │          │ │  └─ Client         │  │ │
│  │  ┌────────────────┐ │          │ └────────────────────┘  │ │
│  │  │  localStorage  │ │          │                          │ │
│  │  │  ├─ authToken  │ │          │ ┌────────────────────┐  │ │
│  │  │  └─ userRole   │ │          │ │  MySQL Database    │  │ │
│  │  └────────────────┘ │          │ │  └─ User table     │  │ │
│  └─────────────────────┘          └──────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow Diagram

### Signup Flow
```
┌─────────────────────────────────────────────────────────────────┐
│ SIGNUP FLOW: New User Registration                              │
└─────────────────────────────────────────────────────────────────┘

USER              FRONTEND              BACKEND              DATABASE
 │                   │                    │                    │
 │ Fills signup form │                    │                    │
 ├──────────────────►│                    │                    │
 │                   │ Validates form     │                    │
 │                   │ (email, password)  │                    │
 │                   │                    │                    │
 │                   │ POST /signup       │                    │
 │                   │ (role, secret)     │                    │
 │                   ├───────────────────►│                    │
 │                   │                    │ Validate secret    │
 │                   │                    │ (if ADMIN)         │
 │                   │                    │                    │
 │                   │                    │ Hash password      │
 │                   │                    │                    │
 │                   │                    │ Create user        │
 │                   │                    ├───────────────────►│
 │                   │                    │                    │ INSERT
 │                   │                    │                    │ User
 │                   │                    │◄───────────────────┤
 │                   │                    │                    │
 │                   │ JWT + Role        │                    │
 │                   │◄───────────────────┤                    │
 │                   │                    │                    │
 │ Show success      │                    │                    │
 │◄──────────────────┤                    │                    │
 │                   │ Store token+role   │                    │
 │                   │ in localStorage    │                    │
 │                   │                    │                    │
 │ Redirect to /signin                   │                    │
 │◄──────────────────┤                    │                    │
 │                   │                    │                    │
```

### Login Flow
```
┌─────────────────────────────────────────────────────────────────┐
│ LOGIN FLOW: Existing User Authentication                        │
└─────────────────────────────────────────────────────────────────┘

USER              FRONTEND              BACKEND              DATABASE
 │                   │                    │                    │
 │ Enters email/pass │                    │                    │
 ├──────────────────►│                    │                    │
 │                   │ Validates form     │                    │
 │                   │                    │                    │
 │                   │ POST /login        │                    │
 │                   ├───────────────────►│                    │
 │                   │                    │ Query user         │
 │                   │                    ├───────────────────►│
 │                   │                    │◄───────────────────┤
 │                   │                    │ User data + role   │
 │                   │                    │                    │
 │                   │                    │ Compare passwords  │
 │                   │                    │ Generate JWT       │
 │                   │                    │                    │
 │                   │ JWT + Role        │                    │
 │                   │◄───────────────────┤                    │
 │                   │                    │                    │
 │                   │ Store token+role   │                    │
 │                   │ in localStorage    │                    │
 │                   │                    │                    │
 │ Check role        │                    │                    │
 ├──────┬───────────►│                    │                    │
 │      │            │ PARTICIPANT?       │                    │
 │      │            │ Redirect /dashboard                     │
 │      │            │                    │                    │
 │      │            │ ADMIN?             │                    │
 │      │            │ Redirect /admin-dashboard              │
 │      │            │                    │                    │
 │      └────────────┤                    │                    │
 │                   │                    │                    │
```

---

## 📊 Component Hierarchy

```
App (App.jsx)
├─ Routes
│  ├─ /signin ──────────────► SignIn.jsx
│  │                         ├─ loginUser()
│  │                         └─ Role-based redirect
│  │
│  ├─ /signup ──────────────► SignUp.jsx
│  │                         ├─ Role selector
│  │                         ├─ Admin secret (conditional)
│  │                         └─ signupUser()
│  │
│  ├─ /dashboard ───────────► StudentDashboard.jsx
│  │                         (PARTICIPANT users)
│  │
│  └─ /admin-dashboard ─────► AdminDashboard.jsx
│                            ├─ Admin-only content
│                            └─ Logout button

Services/
├─ authService.js
│  ├─ signupUser(data)
│  ├─ loginUser(data)
│  ├─ logoutUser()
│  ├─ getAuthToken()
│  ├─ getUserRole()
│  ├─ isAuthenticated()
│  └─ isAdmin()
│
└─ API Integration
   └─ /api/v1/auth/
      ├─ POST /signup
      ├─ POST /login
      └─ POST /logout

Backend/
├─ Controllers
│  └─ auth.controller.js
│     ├─ signup()
│     ├─ login()
│     └─ logout()
│
├─ Services
│  └─ auth.service.js
│     ├─ createUser(role, secret)
│     ├─ findUser(email)
│     └─ comparePassword()
│
├─ Database
│  └─ User (Prisma Model)
│     ├─ id
│     ├─ username
│     ├─ email
│     ├─ password (hashed)
│     ├─ role (ENUM)
│     └─ timestamps
│
└─ Middleware
   └─ JWT validation (future)
```

---

## 🔄 Data Flow Diagram

### Sign Up Request
```
Frontend Form Data
        │
        ├─► Browser validates
        │   ├─ Email format
        │   ├─ Password length ≥ 6
        │   └─ Admin secret (if ADMIN)
        │
        ├─► Fetch POST /api/v1/auth/signup
        │   └─ Body: { username, email, password, role, adminSecret }
        │
        ├─► Backend receives request
        │   ├─ Validates admin secret against "admin123"
        │   ├─ Hashes password with bcrypt
        │   └─ Creates User in database
        │
        ├─► Backend generates JWT
        │   └─ Payload: { userId, email, role, iat, exp }
        │
        ├─► Send response
        │   ├─ token: JWT string
        │   └─ user: { id, username, email, role }
        │
        └─► Frontend processes response
            ├─ localStorage.setItem('authToken', token)
            ├─ localStorage.setItem('userRole', user.role)
            └─ Redirect to /signin
```

---

## 🗄️ Database Schema

```
┌──────────────────────────────────────────┐
│              User Table                  │
├──────────────────────────────────────────┤
│ id           INT (PK, Auto)              │
│ username     VARCHAR(255) UNIQUE         │
│ email        VARCHAR(255) UNIQUE         │
│ password     VARCHAR(255) (Hashed)       │
│ role         ENUM(                       │
│              'PARTICIPANT',              │
│              'ADMIN'                     │
│              ) DEFAULT 'PARTICIPANT'     │
│ is_verified  BOOLEAN DEFAULT FALSE       │
│ created_at   TIMESTAMP DEFAULT NOW()     │
│ last_login   TIMESTAMP NULL              │
│ profile_json JSON NULL                   │
├──────────────────────────────────────────┤
│ Indexes:                                 │
│ - id (PK)                                │
│ - username (UNIQUE)                      │
│ - email (UNIQUE)                         │
└──────────────────────────────────────────┘

Role Values (ENUM):
├─ PARTICIPANT (Default for new users)
└─ ADMIN (Requires secret: "admin123")
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│     AUTHENTICATION SECURITY LAYERS      │
└─────────────────────────────────────────┘

Layer 1: Frontend Validation
├─ Email format validation
├─ Password length check (≥ 6 chars)
├─ Admin secret field (conditional)
└─ Error messages on invalid input

Layer 2: Network Security
├─ Relative URLs (no hardcoded IPs)
├─ CORS configured for dev
├─ HTTP (upgrade to HTTPS in production)
└─ JSON request/response format

Layer 3: Backend Validation
├─ Email/username uniqueness check
├─ Password strength validation
├─ Admin secret validation ("admin123")
├─ Role value validation (enum)
└─ Input sanitization

Layer 4: Password Security
├─ Hashed with bcrypt (never plain text)
├─ Salt rounds: 10 (configurable)
├─ Comparison using bcrypt.compare()
└─ Never transmitted in response

Layer 5: Session Security
├─ JWT token for stateless auth
├─ Token expiration (configurable)
├─ Role stored in JWT payload
├─ Token in localStorage (vulnerable to XSS)
└─ Token cleared on logout

Layer 6: Database Security
├─ Enum constraint on role field
├─ Unique constraint on username/email
├─ Foreign key constraints
└─ Data persistence in MySQL
```

---

## 🎯 Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────┐
│              PARTICIPANT Role (Default)                 │
├─────────────────────────────────────────────────────────┤
│ • Can sign up without special permissions               │
│ • Can login with username/password                      │
│ • Access: /dashboard                                   │
│ • Features: View profile, create ideas, chat           │
│ • Admin functions: None                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          ADMIN Role (Mentor/Incubator/Admin)            │
├─────────────────────────────────────────────────────────┤
│ • Requires admin secret during signup: "admin123"       │
│ • Can login with username/password                      │
│ • Access: /admin-dashboard                             │
│ • Features: User management, analytics, settings       │
│ • Admin functions: All dashboard features              │
└─────────────────────────────────────────────────────────┘

Future Implementation (Protected Routes):
┌─────────────────────────────────────────────────────────┐
│  Route Protection: Routes → Check role → Allow/Block    │
├─────────────────────────────────────────────────────────┤
│  /dashboard ───────► Check role = PARTICIPANT ─► Allow  │
│  /admin-dashboard ─► Check role = ADMIN ───────► Allow  │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 State Management

### Frontend State
```
App Component
├─ Authentication Service
│  └─ localStorage
│     ├─ authToken: JWT string
│     └─ userRole: "PARTICIPANT" | "ADMIN"
│
SignUp Component
├─ formData
│  ├─ username: string
│  ├─ email: string
│  ├─ password: string
│  ├─ role: "PARTICIPANT" | "ADMIN"
│  └─ adminSecret: string
├─ error: string
├─ success: string
└─ loading: boolean

SignIn Component
├─ formData
│  ├─ email: string
│  └─ password: string
├─ error: string
└─ loading: boolean

AdminDashboard Component
└─ Navigation state (via React Router)
```

### Backend State
```
Request Processing
├─ Validate input data
├─ Check database
├─ Hash/compare passwords
├─ Generate JWT token
├─ Set role in response
└─ Return status

Database State
└─ User records with persistent:
   ├─ Credentials (email, hashed password)
   ├─ Role (ENUM value)
   └─ Metadata (created_at, last_login, etc)
```

---

## 🔄 Routing Map

```
Frontend Routes:
├─ /                    → Home page
├─ /about               → About page
├─ /signin              → SignIn component
├─ /signup              → SignUp component
├─ /dashboard           → StudentDashboard (PARTICIPANT)
├─ /admin-dashboard     → AdminDashboard (ADMIN)
├─ /studentdashboard    → StudentDashboard
├─ /studentdashboard/addidea → AddIdea component
└─ /* (404)             → NotFound page

Backend API Routes:
└─ /api/v1/auth/
   ├─ POST /signup     → Register new user
   ├─ POST /login      → Authenticate user
   └─ POST /logout     → Clear session
```

---

## 📊 Request/Response Examples

### Signup Request (Admin)
```
POST /api/v1/auth/signup
Content-Type: application/json

{
  "username": "john_admin",
  "email": "john@admin.com",
  "password": "secure123",
  "role": "ADMIN",
  "adminSecret": "admin123"
}

Response (201 Created):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_admin",
    "email": "john@admin.com",
    "role": "ADMIN"
  },
  "message": "User created successfully"
}
```

### Login Request
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@admin.com",
  "password": "secure123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_admin",
    "email": "john@admin.com",
    "role": "ADMIN"
  },
  "message": "Login successful"
}
```

---

## 🎯 Feature Summary

| Feature | PARTICIPANT | ADMIN |
|---------|-------------|-------|
| Signup | ✓ Easy | ✓ Requires secret |
| Login | ✓ Email/password | ✓ Email/password |
| Dashboard | /dashboard | /admin-dashboard |
| View Profile | ✓ | ✓ |
| Create Ideas | ✓ | ✓ |
| Admin Features | ✗ | ✓ |
| User Management | ✗ | ✓ (future) |
| Analytics | ✗ | ✓ (future) |

---

This architecture provides a scalable, secure, and user-friendly authentication system for the MindNest platform!
