// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (like your p5.js sketches, HTML, CSS)
app.use(express.static('public'));

let connectedUsers = {};  // Object to store IP addresses and count of connected users

io.on('connection', (socket) => {
    // const clientIpAddress = socket.handshake.address;
    const clientIpAddress = Math.random().toString()

    // If IP address is already present, increment the count, else set it to 1
    connectedUsers[clientIpAddress] = (connectedUsers[clientIpAddress] || 0) + 1;

    console.log(`User connected from IP: ${clientIpAddress}. Total users: ${Object.keys(connectedUsers).length}`);

    io.emit('currentUsers', connectedUsers);

    socket.on('disconnect', () => {
        connectedUsers[clientIpAddress]--;

        // Remove IP address entry if no users are connected from that IP
        if (connectedUsers[clientIpAddress] === 0) {
            delete connectedUsers[clientIpAddress];
        }

        console.log(`User disconnected from IP: ${clientIpAddress}. Total users: ${Object.keys(connectedUsers).length}`);

        io.emit('currentUsers', connectedUsers);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

