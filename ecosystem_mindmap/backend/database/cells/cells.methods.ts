import { CellModel } from './cells.model';
import { IGetStemCellResp, IGetCellsByStemCellResp, IGetCellByIdResp, 
        INewCell,
     } from './cells.types';

/* ------------------------------------------------------------
----------- helper request data base --------------------------
------------------------------------------------------------ */
export async function newCell(
    title: string,
    description: string,
    position: number,
    idStemCell: string,
    stemCell: boolean,
        ): Promise<INewCell> {
        const newCell = new CellModel({
            title, description, position, stemCell, 
            idStemCell
        });
        const newCellCreated:any = await newCell.save()
            .then(newCellCreated => {return {'request type': 'create new Cell',
                                             'error': false, 
                                             cellCreated: newCellCreated
                                            }})
            .catch(error => {return {'request type': 'create new Cell',
                                     'error': true, 
                                     'message': error}})
        return newCellCreated;
};

/* __________________________________________________________ */


/* -----------------------------------------------------------
--------------- request data base --------------------------
------------------------------------------------------------ */

export async function getStemCellByMindMap (stemCellId: string): Promise<IGetStemCellResp> { //should be change when module mindmap ready (object mindmap)
    const requestType = 'get Stem Cell By MindMap';
    
    const stemCell = await CellModel.find({idStemCell: stemCellId, stemCell: true})
        .then(stemCellRequest => {return  {'request type': requestType,
                                          'error': false, 
                                          'stemCell': stemCellRequest
                                        }})
        .catch(error => {return {'request type': 'get Stem Cell By MindMap',
                                 'error': true, 
                                 'message': error
                                }})
    return stemCell;
}

export async function getCellsByStemCell (stemCell_Id: string): Promise<IGetCellsByStemCellResp> {
    const requestType = 'get Cells By Stem Cell';

    const cells = await CellModel.find({idStemCell: stemCell_Id})
        .then(cellsRequest => {return {'request type': requestType,
                                          'error': false,
                                          'cells': cellsRequest
                                        }})
        .catch(error => {return {'request type': requestType,
                                 'error': true, 
                                 'message': error}})
    return cells;
}

export async function getCellById (cell_Id: string): Promise<IGetCellByIdResp> {
    const requestType = 'get cells by _id';

    const cell = await CellModel.find({_id: cell_Id})
        .then(cellRequest => {return {'request type': requestType,
                                          'error': false,
                                          'cell': cellRequest
                                        }})
        .catch(error => {return {'request type': requestType,
                                 'error': true, 
                                 'message': error}})
    return cell;
}

export async function createDefaultStemCell (stemCellId: string): Promise<INewCell> {
    const createDefaultStemCell: INewCell = await newCell(
        'Stem Cell',
        'This is the stem cell of this mind map',
        0,
        stemCellId,
        true
    );
    return createDefaultStemCell;
}

export async function createFirstCell (stemCell_idReferent: string): Promise<INewCell> {    
    const createFirstCell: INewCell = await newCell(
        'New Cell',
        '',
        2,
        stemCell_idReferent,
        false
    );
    
    return createFirstCell;
};

export async function addCellInThisPosition (positionOfNewCell: number, stemCell_idReferent: string): Promise<INewCell> {
    const cells: IGetCellsByStemCellResp = await getCellsByStemCell(stemCell_idReferent);
    const newQteCell: number = cells.cells.length*2;

    for(let counter = positionOfNewCell; counter <= newQteCell; counter+=2) {
        const object = await CellModel.find({position: counter, idStemCell: stemCell_idReferent});
        await CellModel.findOneAndUpdate({_id: object[0]._id}, {position: counter + 2})
            .then(() => console.log('cell updated! : ' + object[0]._id))
            .catch(error => console.log('Error update cell : ' + error))
    }

    const addCell = await newCell(
        'New Cell added',
        '',
        positionOfNewCell,
        stemCell_idReferent,
        false
    );
    
    return addCell;
};

export async function deleteCellById (cell_id: string, stemCell_id: string): Promise<IGetCellByIdResp> {

    const cells: IGetCellsByStemCellResp = await getCellsByStemCell(stemCell_id);
    const cellToBeDelete = await getCellById(cell_id);
    const positionCellToBeDelete:number = await cellToBeDelete.cell[0].position;
    const qteCell: number = cells.cells.length*2;
   
    for(let counter = positionCellToBeDelete; counter <= qteCell; counter+=2) {
        const object = await CellModel.find({position: counter, idStemCell: stemCell_id});
      
        await CellModel.findOneAndUpdate({_id: object[0]._id}, {position: counter - 2})
            .then(() => console.log('cell updated! : ' + object[0]._id))
            .catch(error => console.log('Error update cell : ' + error))
    };
    await CellModel.findByIdAndDelete(cellToBeDelete.cell[0]._id); 

    return cellToBeDelete;
};
