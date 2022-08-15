const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const bodyParser = require('body-parser')

const users = []

const port= process.env.PORT|| 3000;

app.use(bodyParser.json())

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
});

app.post('/login',(req, res) => {
        const {name} = req.body
        if (users.some((el) => el === name)) {
            res.status(400).json({message:`Никнейм ${name} уже занят `})
        } else {
            users.push(name)
            res.status(200).json({user: name})
        }
        res.send(`User ${name} logged in`)
} )

io.on('connection', (socket) => {
    console.log('user a ' +
        '')
    socket.on('chatMessage', (...args) => {
        console.log(args)
        socket.emit('chatMessage',args )
    })
});

server.listen(port, () => {
    console.log(`server started on port ${port}`);
});