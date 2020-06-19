import express from 'express';
import { Connect } from './database/database';
import http from 'http';
import socketio from 'socket.io';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5005;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});

app.use(cors({ origin: "http://localhost" }));

app.use(express.json());

Connect();

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('user join the mind map', async ( name, mindmap, fn) => {
        await fn(`welcome ${name} to the ${mindmap}`);  
        socket.broadcast.emit('broadcast the user join the mindmap', 
        `${name} has join the mindmap`);
    });
});

app.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
});