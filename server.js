const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.static('../front'));

const messages = [];

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.emit('chat_history', messages);

    socket.on('chat_message', (message) => {
        const messageWithTimestamp = {
            ...message,
            timestamp: new Date().toISOString()
        };

        messages.push(messageWithTimestamp);

        io.emit('chat_message', messageWithTimestamp);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 