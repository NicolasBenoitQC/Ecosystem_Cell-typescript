import express from 'express';
import { Connect } from './database/database';
import http from 'http';
import socketio from 'socket.io';
import { getEcoSystemByStemCellId, getCellByProps_Id, createDefaultStemCell,
        addCell, updatePropsCellById, deleteCellAndAllChilds,
         } from './database/cells/cells.methods';
import { ICell} from './database/cells/cells.types';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// --------- Database -----------
Connect('CellsMindMap');
// ------------------------------

// Socket.io --------------------
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', async (socket) => {

    socket.on('get ecosystem',
        async (stemCell_id: string, parentIsMindMap: boolean, fn) => {
            const ecosystem = await getEcoSystemByStemCellId(stemCell_id, parentIsMindMap);
            await fn(ecosystem);

            //console.log(ecosystem)
        }
    );

    socket.on('get cell by _id', 
        async (idCell: string, fn) => {
            const cell = await getCellByProps_Id(idCell);
            await fn(cell);
        
            //console.log(cell);
        }
    );

    socket.on('create default stem cell', 
        async (stemCellId, fn) => {     
            const defaultStemCell = await createDefaultStemCell(stemCellId);  
            await fn(defaultStemCell);
            
            //console.log(defaultStemCell);
        }
    );

    socket.on('add cell', 
        async (cell:ICell, parentTree: string[], fn) => {
            const newCell = await addCell(cell, parentTree);
            await fn(newCell);

            //console.log(newCell)
        }      
    );

    socket.on('update props cell', 
        async (cellUpdated:ICell, fn) => {            
            const updatePropsCell =  await updatePropsCellById(cellUpdated);
            fn(updatePropsCell);
            
            //console.log(updatePropsCell);
        }
    );

    socket.on('delete cell and all child', 
        async (cell: ICell, fn) => {
            const deleteCells = await deleteCellAndAllChilds(cell._id, cell.idStemCell);
            fn(deleteCells);

            //console.log(deleteCells)
        }
    );

});

server.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
});