import express from 'express';
import { Connect } from './database/database';
import http from 'http';
import socketio from 'socket.io';
import { 
    getStemCellByMindMap, getCellsByStemCell, getCellById,
    createDefaultStemCell, createFirstCell,
    addCellInThisPosition, addCell, deleteCellById,
    updatePropsCellById,
         } from './database/cells/cells.methods';
import { ICell} from './database/cells/cells.types';
import { CellModel } from './database/cells/cells.model';


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

    socket.on('user join the mind map', 
        async (name, fn) => {
            await fn(`welcome ${name} to the mindmap`);  
            
            socket.broadcast.emit('broadcast the user join the mindmap', 
                                    `new user ${name} has join the mindmap`);
        }
    );

    socket.on('get stem cell by mind map', 
        async (stemCellId, fn) => {     
            const stemCell = await getStemCellByMindMap(stemCellId);
            await fn(stemCell);
            console.log(stemCell);
        }
    );

    socket.on('get cells by stem cell', 
        async (stemCell, fn) => {     
            const cells = await getCellsByStemCell(stemCell[0]._id);  
            await fn(cells);
            console.log(cells);
        }
    );

    socket.on('create default stem cell', 
        async (stemCellId, fn) => {     
            const defaultStemCell = await createDefaultStemCell(stemCellId);  
            await fn(defaultStemCell);
            
            console.log(defaultStemCell);
        }
    );

    socket.on('create first cell of the stem cell', 
        async (stemCellReferent: ICell[], fn) => {
            const newCell = await createFirstCell (stemCellReferent[0]._id);
            await fn(newCell);
            
            socket.broadcast.emit('first cell of the mindmap created', 
                'return first cell');

            console.log(newCell);
        }
    );

    socket.on('add cell in this position', 
        async (positionOfNewCell:number, stemCellReferent:ICell[], fn) => {
            const newCell = await addCellInThisPosition(positionOfNewCell, stemCellReferent[0]._id);
            await fn(newCell);
            
            socket.broadcast.emit('cell added to a specific position', 
                await fn(newCell));

            console.log(newCell)
        }
    );

    socket.on('add cell', 
        async (cell:ICell, fn) => {
            const newCell = await addCell(cell);
            await fn(newCell);
            
            socket.broadcast.emit('cell added to a specific position', 
                await fn(newCell));

            console.log(newCell)
        }
    );

    socket.on('get cell by _id', 
        async (idCell: string, fn) => {
            const cell = await getCellById(idCell);
            await fn(cell);
        
            console.log(cell);
        }
    );

    socket.on('update props cell', 
        async (idCell: string, cellUpdated:ICell, fn) => {
            const updatePropsCell = await updatePropsCellById(idCell, cellUpdated);
            fn(updatePropsCell);
            console.log(updatePropsCell);
        
            socket.broadcast.emit('cell has updated', 
                'one cell has updated!')
        }
    );

    socket.on('delete cell by id', 
        async (cell_id: string, stemCell_id : string) => {
            await deleteCellById(cell_id, stemCell_id)
        
            socket.broadcast.emit('cell deleted by id', 
                `cell ${cell_id} deleted!`);
        
            console.log(`cell ${cell_id} deleted!`);
        }
    );

/* -------------------------------------------------------------------------
-----------------------------RESET use for DEV -----------------------------
-------------------------------------------------------------------------*/

    socket.on('RESET', async () => {     
       
        const get6 = await CellModel.find({position: 6})
        await CellModel.deleteOne(get6[0])
        const get4 = await CellModel.find({position: 4})
        await CellModel.deleteOne(get4[0])
        const get2 = await CellModel.find({position: 2})
        await CellModel.deleteOne(get2[0])
    });

/* -------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------*/
});

server.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
});