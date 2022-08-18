const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:8080',
    }
});
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;

const users = [{name:'Nikita', token: 1660732113229}]

app.use(bodyParser.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




app.post('/login', (req, res) => {
    const {name} = req.body
    if (!name) {
        res.status(400).json({success: false,message: 'Поле name обязательное'})
        return
    }
    if (users.some((el) => el.name === name)) {
        res.status(401).json({success: false, message: `Имя ${name} уже занято `})
    } else {
        const token = Date.now()
        const user = {name, token}
        users.push(user)
        res.status(200).json({success: true, token: token})
    }
})

io.on("connection", (socket) => {
    const token = socket.handshake.auth.token
    const user = users.find(el => el.token == token)
    if (!token) {
        socket._error(error => {
            console.error(error)
        })
    }
    else {
        console.log(`user ${user.name} connected`)
        io.emit('login', user.name)
    }

    socket.on('disconnect', () => {
        console.log(`user ${user.name} disconnected`);
        io.emit('user disconnected')
    });

    socket.on('chat message', (...args) => {
        io.emit('chat message', args);
    });
});


httpServer.listen(port, () => {
    console.log(`server started on port ${port}`);
});