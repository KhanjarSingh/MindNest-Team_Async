const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const process = require('process')
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const http = require('http');
const socket = require('socket.io');
dotenv.config()

const app = express()
const port = process.env.PORT || 3002
server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.use('/api', routes);

const { createMessage } = require('./services/chat.service');

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join', (userId) => {
        socket.userId = userId;
        socket.join(userId.toString());
        console.log(`User ${userId} joined room`);
    });

    socket.on('sendMessage', async (data) => {
        const { receiverId, content } = data;
        const senderId = socket.userId;

        if (!senderId) {
            console.error('No sender ID found');
            return;
        }

        try {
            const message = await createMessage(senderId, receiverId, content);
            // Send to receiver
            io.to(receiverId.toString()).emit('receiveMessage', message);
            // Also send back to sender for confirmation
            socket.emit('receiveMessage', message);
        } catch (error) {
            console.error('Socket message error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use((err, req, res, next) => {
    console.error('=== GLOBAL ERROR HANDLER ===');
    console.error('Error:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

server.listen(port, () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.SERVER_URL || `http://localhost:${port}`
        : `http://localhost:${port}`;
    console.log(`Server is running at ${baseUrl}`);
})