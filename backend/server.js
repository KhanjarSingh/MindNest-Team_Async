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
const port = process.env.PORT || 3000
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
    console.log('Request body:', req.body);
    next();
});

app.use('/api', routes);

io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('sendMessage', async (data) => {
        const { receiverId, content } = data;
        const senderId = socket.userId;

        try {
            const message = await createMessage(senderId, receiverId, content);
            io.to(receiverId).emit('receiveMessage', message);
        } catch (error) {
            console.error('Socket message error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
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
    console.log(`Server is running at http://localhost:${port}`)
})