import { CellModel } from './cells.model';
import { ICell,
        IGetStemCellResp, IGetCellsResp,
        INewCell
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
    const stemCell: any = await CellModel.find({idStemCell: stemCellId, stemCell: true})
        .then(stemCellRequest => {return {'request type': 'get Stem Cell By MindMap',
                                          'error': false, 
                                          'stemCell': stemCellRequest
                                        }})
        .catch(error => {return {'request type': 'get Stem Cell By MindMap',
                                 'error': true, 
                                 'message': error
                                }})
    return stemCell;
}

export async function getCellsByStemCell (stemCell: ICell[]): Promise<IGetCellsResp> {
    const cells:any = await CellModel.find({idStemCell: stemCell[0]._id})
        .then(stemCellRequest => {return {'request type': 'get Cells By Stem Cell',
                                          'error': false,
                                          'cells': stemCellRequest
                                        }})
        .catch(error => {return {'request type': 'get Cells By Stem Cell',
                                 'error': true, 
                                 'message': error}})
    return cells;
}

export async function createDefaultStemCell (stemCellId: string) {
    const createDefaultStemCell = await newCell(
        'Stem Cell',
        'This is the stem cell of this mind map',
        0,
        stemCellId,
        true
    );
    return createDefaultStemCell;
}

export async function createFirstCell (stemCellReferent: ICell[]) {    
    const createFirstCell = await newCell(
        'New Cell',
        '',
        2,
        stemCellReferent[0]._id,
        false
    );
    
    return createFirstCell;
};

export async function addCellInThisPosition (positionOfNewCell: number, stemCellReferent: ICell[]) {
    const cells: IGetCellsResp = await getCellsByStemCell(stemCellReferent);
    const newQteCell = cells.cells.length*2;

    for(let counter = positionOfNewCell; counter <= newQteCell; counter+=2) {
        const object = await CellModel.find({position: counter, idStemCell: stemCellReferent[0]._id});
        await CellModel.findOneAndUpdate({_id: object[0]._id}, {position: counter + 2})
            .then(() => console.log('cell updated! : ' + object[0]._id))
            .catch(error => console.log('Error update cell : ' + error))
    }

    const addCell = await newCell(
        'New Cell added',
        '',
        positionOfNewCell,
        stemCellReferent[0]._id,
        false
    );
    
    return addCell;
};

export async function deleteCellById (cell_id: string, stemCell_id: string) {

    const cells:any = await CellModel.find({idStemCell: stemCell_id})
        .then(stemCellRequest => {return {'request type': 'get Cells By Stem Cell',
                                          'error': false,
                                          'cells': stemCellRequest
                                        }})
        .catch(error => {return {'request type': 'get Cells By Stem Cell',
                                 'error': true, 
                                 'message': error}})

   const cellToBeDelete : any = await CellModel.find({_id: cell_id});

   const positionCellToBeDelete:number = await cellToBeDelete[0].position
   
   const qteCell = cells.cells.length*2
   console.log(qteCell);
   
   for(let counter = positionCellToBeDelete; counter <= qteCell; counter+=2) {
      const object = await CellModel.find({position: counter, idStemCell: stemCell_id});
      console.log(object);
      
      await CellModel.findOneAndUpdate({_id: object[0]._id}, {position: counter - 2})
        .then(() => console.log('cell updated! : ' + object[0]._id))
        .catch(error => console.log('Error update cell : ' + error))
   }
   await CellModel.findByIdAndDelete(cellToBeDelete[0]._id); 
   
};
