import express from 'express';
import { Connect, disconnect } from './database/database';
import http from 'http';
import socketio from 'socket.io';
//import { CellModel } from './database/cells/cells.model';


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// --------- Database -----------
//Connect();
// ------------------------------

// Socket.io --------------------
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
 
    socket.on('user join the mind map', async (name, fn) => {
        await fn(`welcome ${name} to the mindmap`);  
        socket.broadcast.emit('broadcast the user join the mindmap', 
        `new user has join the mindmap`);
    });

    socket.on('get all cells', async (fn) => {           
        const db:any = Connect();
        const cells:any = await db.CellModel.findAllCells();
            
        await fn(cells);
        console.log('get all cells')
        //disconnect()
    });
    socket.on('get stem cell', async (fn) => {
        const db:any = Connect();
        const stemCell:any = await db.CellModel.findStemCell();
        
        await fn(stemCell);
        console.log('get stem cell')
        
        //disconnect()
    });
    
    /* 
    socket.on('get cell by _id', async (idCell, fn) => {
        const db:any = Connect();
        const cell:any = await db.CellModel.findCellBy_id(idCell);
            
        await fn(cell);
        console.log('get cell by _id')
        
        /* CellModel.find({_id: idCell})
        .then(async cell => await fn(cell))
        .catch( error => console.log('Error from request get cell by _id : ' + error ))
        
    });
 
    socket.on('update props cell', async (_id, updateCell) => {
        
        const db:any = Connect();
        //await db.CellModel.updateCell(_id,updateCell)
       // .then(socket.broadcast.emit('update', 'updated'))
    
        /* CellModel.findById(_id)
        .then(async cell => {
            cell.title = updateCell.title
            cell.description = updateCell.description
            
            await cell.save()
            .then(() => console.log('cell updated!'))
            .catch(error => console.log('Error update cell: ' + error))
        })
        .then(socket.broadcast.emit('update', 'updated'))
        .catch(error => console.log('Error : ' + error)) 
    });
 */
});

server.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
});