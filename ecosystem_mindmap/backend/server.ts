import express from 'express';
import { Connect } from './database/database';
import http from 'http';
import socketio from 'socket.io';
import { CellModel } from './database/cells/cells.model';
import { getAllCells, deleteCellById, addCellInThisPosition } from './database/cells/cells.methods';


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// --------- Database -----------
Connect();
// ------------------------------

// Socket.io --------------------
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', async (socket) => {
 
    socket.on('user join the mind map', async (name, fn) => {
        await fn(`welcome ${name} to the mindmap`);  
        socket.broadcast.emit('broadcast the user join the mindmap', 
        `new user has join the mindmap`);
    });

    socket.on('get all cells', async (fn) => {     
        const cells = await getAllCells();  
        await fn(cells);
    });

    socket.on('get stem cell', async (fn) => {
        await CellModel.find({stemCell: true})
        .then(async stemCell => await fn(stemCell))
        .catch(error => console.log('Error request get stem cell : ' + error))

        console.log('stem cell obtained')
    });

    socket.on('get cell by _id', async (idCell, fn) => {
        await CellModel.find({_id: idCell})
        .then(async cell => await fn(cell))
        .catch( error => console.log('Error from request get cell by _id : ' + error ))
        
        console.log('cell obtained by ID')
    });
    
    socket.on('update props cell', async (idCell, cellUpdated) => {
        await CellModel.findOneAndUpdate({_id: idCell}, cellUpdated)
        .then(() => console.log('cell updated!'))
        .catch(error => console.log('Error update cell : ' + error)) 
        
        socket.broadcast.emit('cell has updated', 'one cell has updated!')
    });

    socket.on('delete cell by id', async (cell_id) => {
        await deleteCellById(cell_id)
        socket.broadcast.emit('cell deleted by id', 'cell deleted!');
        console.log('cell deleted!');
    });

    socket.on('add cell in this position', async (positionIdOfNewCell:any, fn) => {
        await addCellInThisPosition(positionIdOfNewCell);
        socket.broadcast.emit('cell added to a specific position', 'cell added!');
        console.log('cell added!');
    })

});

server.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
});