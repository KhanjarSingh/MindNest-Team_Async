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
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true
    }
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,                
}));


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

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})