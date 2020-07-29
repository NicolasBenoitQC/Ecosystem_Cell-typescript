import express from 'express';
import { Connect } from './database/database';
import http from 'http';
import socketio from 'socket.io';
import { getEcoSystemByStemCellId,
    getStemCellByMindMap, getCellsByStemCell, getCellById,
    createDefaultStemCell
    , addCell, deleteCellById,
    updatePropsCellById,getChildCellsByStemCellId,
    deleteCellAndAllChilds,
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
    socket.on('get ecosystem',
        async (stemCell_id: string, parentIsMindMap: boolean, fn) => {
            const ecosystem = await getEcoSystemByStemCellId(stemCell_id, parentIsMindMap);
            await fn(ecosystem);
            console.log(ecosystem)
        }
    )

    
    socket.on('get Child Cells By Stem Cell Id',
        async (stemCell_id: string, fn) => {
            const child = await getChildCellsByStemCellId(stemCell_id);
            await fn(child);
            console.log(child)
        }
    )

    socket.on('get stem cell by mind map', 
        async (stemCellId, fn) => {     
            const stemCell = await getStemCellByMindMap(stemCellId);
            await fn(stemCell);
            //console.log(stemCell);
        }
    );

    socket.on('get cells by stem cell', 
        async (stemCellId:string, fn) => {     
            const cells = await getCellsByStemCell(stemCellId);  
            await fn(cells);
            //console.log(stemCell)
        }
    );

    socket.on('create default stem cell', 
        async (stemCellId, fn) => {     
            const defaultStemCell = await createDefaultStemCell(stemCellId);  
            await fn(defaultStemCell);
            
            console.log(defaultStemCell);
        }
    );

    /* socket.on('create first cell of the stem cell', 
        async (stemCellReferent: ICell[], fn) => {
            const newCell = await createFirstCell (stemCellReferent[0]._id);
            await fn(newCell);
            
            socket.broadcast.emit('first cell of the mindmap created', 
                'return first cell');

            //console.log(newCell);
        }
    ); */

    /* socket.on('add cell in this position', 
        async (positionOfNewCell:number, stemCellReferent:ICell[], fn) => {
            const newCell = await addCellInThisPosition(positionOfNewCell, stemCellReferent[0]._id);
            await fn(newCell);
            
            socket.broadcast.emit('cell added to a specific position', 
                await fn(newCell));

            //console.log(newCell)
        }
    ); */

    socket.on('add cell', 
        async (cell:ICell, fn) => {
            const newCell = await addCell(cell);
            await fn(newCell);
            
            socket.broadcast.emit('cell added', 
                'one cell added!')

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
        async (cellUpdated:ICell, fn) => {
            //console.log(cellUpdated);
            
            const updatePropsCell =  await updatePropsCellById(cellUpdated);
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
        
            //console.log(`cell ${cell_id} deleted!`);
        }
    );

    socket.on('delete cell and all child', 
        async (cell_id: string, stemCell_id : string, fn) => {
            const deleteCells = await deleteCellAndAllChilds(cell_id, stemCell_id);
            fn(deleteCells);
            console.log(deleteCells)

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
        const get0 = await CellModel.find({position: 0})
        await CellModel.deleteOne(get0[0])
    });

/* -------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------*/
});

server.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
});