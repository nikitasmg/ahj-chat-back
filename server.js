const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const cors = require('cors')
const bodyParser = require('body-parser')
const port= process.env.PORT|| 3000;

const users = []

app.use(bodyParser.json())
app.use(cors())


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

io.on("connection", (socket) => {
    console.log('user connected')
    console.log(socket.handshake)

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('user disconnected')
    });

    socket.on('chat message', (args) => {
        const {name, message} = args
        console.log(name, message);
        io.emit("chat message", args)
    });
});


httpServer.listen(port, () => {
    console.log(`server started on port ${port}`);
});