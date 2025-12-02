# MindNest - Team Async Architecture

## System Overview

MindNest is a full-stack web application built with a modern microservices-inspired architecture, featuring a React frontend, Node.js backend, and MySQL database. The system supports real-time communication through WebSocket connections and implements role-based access control for students and administrators.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + Vite                                               │
│  ├── Components (UI/UX)                                        │
│  ├── Pages (Routes)                                            │
│  ├── Services (API Clients)                                    │
│  └── State Management                                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS + WebSocket
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Node.js + Express                                             │
│  ├── Routes (API Endpoints)                                    │
│  ├── Controllers (Business Logic)                              │
│  ├── Middlewares (Auth, CORS, etc.)                           │
│  ├── Services (Data Processing)                                │
│  └── Socket.io (Real-time Communication)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Prisma ORM
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  MySQL Database                                                │
│  ├── Users & Roles                                             │
│  ├── Ideas & Submissions                                       │
│  ├── Chat Messages                                             │
│  └── Application Metadata                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Technologies
- **React 18**: Modern UI library with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Socket.io Client**: Real-time communication
- **JWT Decode**: Token parsing and validation

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Prisma ORM**: Type-safe database client
- **Socket.io**: Real-time bidirectional communication
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

### Database & Infrastructure
- **MySQL**: Relational database management system
- **Vercel**: Frontend hosting and deployment
- **Render**: Backend hosting and deployment

## System Architecture

### 1. Frontend Architecture

```
src/
├── components/
│   ├── chat/                    # Real-time messaging components
│   │   ├── ChatWindow.jsx       # Main chat interface
│   │   └── ConversationList.jsx # Admin conversation management
│   ├── layout/                  # Layout components
│   ├── navbar/                  # Navigation components
│   ├── ui/                      # Reusable UI components (Radix)
│   └── [feature-components]/    # Feature-specific components
├── pages/
│   ├── Auth/                    # Authentication pages
│   ├── studentDashboard/        # Student-specific pages
│   ├── AdminDashboard.jsx       # Admin management interface
│   ├── Connect.jsx              # Student-admin chat page
│   └── Home.jsx                 # Landing page
├── services/
│   ├── authService.js           # Authentication API calls
│   ├── chatService.js           # Chat API calls
│   ├── ideaService.js           # Idea management API calls
│   └── websocketService.js      # Real-time communication
└── App.jsx                      # Main application component
```

### 2. Backend Architecture

```
backend/
├── config/
│   └── prisma.js                # Database configuration
├── controllers/
│   ├── auth.controller.js       # Authentication logic
│   ├── chat.controller.js       # Chat message handling
│   ├── idea.controller.js       # Idea management logic
│   └── jwt.controller.js        # JWT token management
├── middlewares/
│   └── auth.middleware.js       # Authentication middleware
├── routes/
│   └── v1/
│       ├── auth.routes.js       # Authentication endpoints
│       ├── chat.route.js        # Chat endpoints
│       ├── idea.routes.js       # Idea management endpoints
│       └── index.js             # Route aggregation
├── services/
│   ├── auth.service.js          # Authentication business logic
│   ├── chat.service.js          # Chat business logic
│   └── idea.service.js          # Idea business logic
├── prisma/
│   ├── schema.prisma            # Database schema definition
│   ├── migrations/              # Database migrations
│   └── seed.js                  # Database seeding
└── server.js                    # Application entry point
```

## Database Schema

### Core Entities

#### Users Table
```sql
User {
  id               Int       @id @default(autoincrement())
  username         String    @unique
  email            String    @unique
  password         String    (hashed)
  roleId           Int       @default(0)
  role             Role      @relation
  is_verified      Boolean   @default(false)
  created_at       DateTime  @default(now())
  last_login       DateTime?
  profile_json     Json?
  receivedMessages Chat[]    @relation("ReceivedMessages")
  sentMessages     Chat[]    @relation("SentMessages")
  ideas            Idea[]
}
```

#### Roles Table
```sql
Role {
  id    Int    @id
  name  String @unique  // "STUDENT" | "ADMIN"
  users User[]
}
```

#### Ideas Table
```sql
Idea {
  id            String   @id @default(cuid())
  title         String
  pitch         String   @db.Text
  description   String   @db.Text
  demoLink      String?
  pitchDeckUrl  String?
  ppt_Url       String?
  userId        Int?
  user          User?    @relation
  status        String   @default("under_review")
  score         Int?
  fundingAmount Int?
  note          String?  @db.Text
  tags          String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### Chat Table
```sql
Chat {
  id         Int      @id @default(autoincrement())
  senderId   Int
  receiverId Int
  content    String   @db.Text
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  receiver   User     @relation("ReceivedMessages")
  sender     User     @relation("SentMessages")
}
```

## API Architecture

### RESTful API Design

#### Authentication Endpoints
```
POST /api/v1/auth/signup     # User registration
POST /api/v1/auth/login      # User authentication
```

#### Idea Management Endpoints
```
GET    /api/v1/ideas         # Get all ideas (admin)
GET    /api/v1/ideas/user    # Get user's ideas
POST   /api/v1/ideas         # Submit new idea
PATCH  /api/v1/ideas/:id/status        # Update idea status
PATCH  /api/v1/ideas/:id/score         # Update idea score
PATCH  /api/v1/ideas/:id/fundingAmount # Update funding
PATCH  /api/v1/ideas/:id/note          # Update admin notes
PATCH  /api/v1/ideas/:id/tags          # Update idea tags
```

#### Chat Endpoints
```
POST /api/v1/chat/send                 # Send message
GET  /api/v1/chat/history/:receiverId  # Get chat history
GET  /api/v1/chat/conversations        # Get all conversations (admin)
```

### WebSocket Events

#### Client → Server
```javascript
'join'        // Join user room: { userId }
'sendMessage' // Send message: { receiverId, content }
```

#### Server → Client
```javascript
'receiveMessage' // New message: { message object }
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with expiration
- **Role-Based Access Control**: Student vs Admin permissions
- **Password Hashing**: bcrypt with salt rounds
- **Route Protection**: Middleware-based authentication

### Data Security
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data in environment files

## Real-time Communication

### WebSocket Architecture
```
Client                    Server                    Database
  │                        │                         │
  ├─ connect()            │                         │
  │                       ├─ socket.join(userId)    │
  │                       │                         │
  ├─ sendMessage()        │                         │
  │                       ├─ createMessage()        │
  │                       │                        ├─ INSERT chat
  │                       │                        │
  │                       ├─ emit('receiveMessage') │
  ├─ receiveMessage()     │                         │
```

### Message Flow
1. User sends message via API endpoint
2. Server validates and stores in database
3. Server broadcasts message via WebSocket to recipient
4. Real-time UI update on both sender and receiver sides

## Deployment Architecture

### Frontend Deployment (Vercel)
```
GitHub Repository
       │
       ├─ Push to main branch
       │
       ▼
Vercel Build Pipeline
       │
       ├─ npm run build
       ├─ Static file generation
       │
       ▼
CDN Distribution
       │
       └─ Global edge locations
```

### Backend Deployment (Render)
```
GitHub Repository
       │
       ├─ Push to main branch
       │
       ▼
Render Build Pipeline
       │
       ├─ npm install
       ├─ Environment setup
       │
       ▼
Container Deployment
       │
       ├─ Node.js runtime
       ├─ Database connection
       └─ WebSocket support
```

## Performance Considerations

### Frontend Optimizations
- **Code Splitting**: Route-based lazy loading
- **Component Memoization**: React.memo for expensive components
- **Bundle Optimization**: Vite's tree shaking and minification
- **Image Optimization**: Responsive images and lazy loading

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: In-memory caching for frequently accessed data
- **Rate Limiting**: API endpoint protection

### Real-time Optimizations
- **Connection Management**: Automatic reconnection handling
- **Message Queuing**: Offline message delivery
- **Room-based Broadcasting**: Targeted message delivery

## Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: JWT-based authentication for load balancing
- **Database Sharding**: User-based data partitioning
- **CDN Integration**: Static asset distribution
- **Microservices Migration**: Service separation for independent scaling

### Monitoring & Logging
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: API response time tracking
- **User Analytics**: Feature usage and engagement metrics
- **Health Checks**: System availability monitoring

## Development Workflow

### Local Development
1. **Database Setup**: MySQL with Prisma migrations
2. **Environment Configuration**: Local environment variables
3. **Concurrent Development**: Frontend and backend servers
4. **Hot Reloading**: Vite for frontend, nodemon for backend

### Testing Strategy
- **Unit Testing**: Component and service testing
- **Integration Testing**: API endpoint testing
- **E2E Testing**: User workflow validation
- **Real-time Testing**: WebSocket connection testing

## Future Enhancements

### Planned Features
- **File Upload System**: Document and image sharing
- **Notification System**: Real-time alerts and updates
- **Advanced Analytics**: Detailed reporting dashboard
- **Mobile Application**: React Native implementation

### Technical Improvements
- **Microservices Architecture**: Service decomposition
- **Redis Integration**: Caching and session management
- **GraphQL API**: Flexible data querying
- **Docker Containerization**: Consistent deployment environments

---

This architecture supports the current feature set while providing a foundation for future scalability and enhancement. The modular design allows for independent development and deployment of different system components.
