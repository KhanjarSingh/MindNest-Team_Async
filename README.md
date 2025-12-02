# MindNest - Team Async

## About

An incubation and collaboration platform for students, mentors, and faculty. MindNest combines features of LinkedIn, GitHub, and an incubation hub to help students submit startup ideas, build teams, get mentorship, join events, and track progress all in one place.

🌐 **Live Demo**: [mind-nest-team-async.vercel.app](https://mind-nest-team-async.vercel.app)

## Features

- 🚀 **Idea Submission**: Students can submit startup ideas with detailed descriptions
- 💬 **Real-time Chat**: Direct messaging between students and admin support
- 👨‍💼 **Admin Dashboard**: Comprehensive management of ideas and user conversations
- 🔐 **Role-based Access**: Separate interfaces for students and administrators
- 📊 **Idea Management**: Track, score, and fund promising startup ideas
- 🎯 **Modern UI**: Clean, responsive design with dark/light theme support

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Radix UI** components
- **Socket.io Client** for real-time messaging
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Prisma ORM** with MySQL database
- **Socket.io** for real-time communication
- **JWT** authentication
- **bcrypt** for password hashing

## Project Structure

```
MindNest-Team_Async/
├── backend/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   ├── idea.controller.js
│   │   └── jwt.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   │   └── v1/
│   │       ├── auth.routes.js
│   │       ├── chat.route.js
│   │       ├── idea.routes.js
│   │       └── index.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── chat.service.js
│   │   └── idea.service.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   └── client/
│       ├── src/
│       │   ├── components/
│       │   │   ├── chat/
│       │   │   │   ├── ChatWindow.jsx
│       │   │   │   └── ConversationList.jsx
│       │   │   ├── layout/
│       │   │   │   └── Nav.jsx
│       │   │   ├── navbar/
│       │   │   │   └── ProfileDropdown.jsx
│       │   │   ├── ui/
│       │   │   │   └── [shadcn components]
│       │   │   ├── AdminRoute.jsx
│       │   │   ├── Navigation.jsx
│       │   │   └── [other components]
│       │   ├── pages/
│       │   │   ├── Auth/
│       │   │   │   ├── SignIn.jsx
│       │   │   │   └── SignUp.jsx
│       │   │   ├── studentDashboard/
│       │   │   │   ├── MyIdeas.jsx
│       │   │   │   └── SubmitYourIdea.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── Connect.jsx
│       │   │   └── Home.jsx
│       │   ├── services/
│       │   │   ├── authService.js
│       │   │   ├── chatService.js
│       │   │   ├── ideaService.js
│       │   │   └── websocketService.js
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## Database Schema


<img width="821" height="658" alt="Screenshot 2025-12-02 at 7 24 27 PM" src="https://github.com/user-attachments/assets/1bbc7c53-c87c-4ea6-b5ca-105ae2d351fc" />

The database includes the following main entities:
- **Users**: Student and admin accounts with role-based access
- **Ideas**: Startup idea submissions with status tracking
- **Chats**: Real-time messaging between users and admins
- **Roles**: User role management (Student/Admin)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KhanjarSingh/MindNest-Team_Async/
   cd MindNest-Team_Async
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/mindnest"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3002
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend/client
   npm install
   ```

6. **Start Development Servers**
   
   Backend:
   ```bash
   cd backend
   npm start
   ```
   
   Frontend:
   ```bash
   cd frontend/client
   npm run dev
   ```

## Authentication & Access

### Student Registration
1. Navigate to `/signup`
2. Fill in your details:
   - Username
   - Email
   - Password
3. Click "Sign Up"
4. You'll be redirected to the student dashboard

### Student Login
1. Navigate to `/signin`
2. Enter your credentials
3. Access student features:
   - Submit ideas
   - View your submissions
   - Chat with admin support

### Admin Access
1. Navigate to `/signin`
2. Use admin credentials:
   - **Admin Key**: admin123
3. Access admin features:
   - Review all student ideas
   - Manage idea status and funding
   - Chat with students
   - View conversation dashboard

### Admin User Creation
To create an admin user, you can either:
1. **Database Direct**: Insert user with `roleId: 1` (Admin role)
2. **Seed Script**: Run the database seed to create default admin
3. **Manual Registration**: Register normally, then update role in database

## Key Features Usage

### For Students
- **Submit Ideas**: Navigate to "Submit Idea" to propose your startup
- **Track Progress**: View "My Ideas" to see status and admin feedback
- **Get Support**: Use "Connect" to chat directly with admin team

### For Administrators
- **Idea Management**: Review, score, and fund student submissions
- **Communication**: Respond to student queries via integrated chat
- **Dashboard Analytics**: Track submission metrics and funding allocation

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login

### Ideas
- `GET /api/v1/ideas` - Get all ideas (admin)
- `GET /api/v1/ideas/user` - Get user's ideas
- `POST /api/v1/ideas` - Submit new idea
- `PATCH /api/v1/ideas/:id/status` - Update idea status

### Chat
- `POST /api/v1/chat/send` - Send message
- `GET /api/v1/chat/history/:receiverId` - Get chat history
- `GET /api/v1/chat/conversations` - Get all conversations (admin)

## Real-time Features

The application uses Socket.io for real-time communication:
- **Instant Messaging**: Messages appear immediately for both parties
- **Live Updates**: Admin dashboard updates when new messages arrive
- **Connection Management**: Automatic reconnection handling

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect repository to hosting platform
2. Set environment variables
3. Configure start command: `npm start`
4. Ensure database connection is properly configured

## Environment Variables

### Frontend
```env
VITE_API_URL=https://your-backend-url.com
```

### Backend
```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-jwt-secret-key
PORT=3002
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Live Demo

- 🌐 Live Demo: [mind-nest-team-async.vercel.app](https://mind-nest-team-async.vercel.app)

---

**MindNest Team Async** - Empowering student innovation through collaborative incubation 🚀
