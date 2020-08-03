import { CellModel, ParentsTreeOfTheCellModel } from './cells.model';
import { ICell, IgetChildCellsByStemCellId, IgetStemCell, 
        IgetEcoSystemByStemCellId, IGetCellByIdResp, INewCell,
        IUpdatePropsCellResp, INewParentsTreeOfTheCellResp, IGetAllIdOfChildCellsResp,
     } from './cells.types';

/* ------------------------------------------------------------
----------- helper request data base --------------------------
------------------------------------------------------------ */
export async function getStemCellByTheMindMapId (mindMapId: string): Promise<IgetStemCell> {
    const requestType = 'Get stem cell by the mind map id';
    
    const stemCell_Request = await CellModel.find({idStemCell: mindMapId})
        .then(stemCell_Response => {return  {'request type': requestType,
                                          'error': false, 
                                          'stemCell_Request': stemCell_Response
                                        }})
        .catch(error => {return {'request type': requestType,
                                 'error': true, 
                                 'message': error
                                }})
    return stemCell_Request;
};

export async function getStemCellById (stemCellId: string): Promise<IgetStemCell> {
    const requestType = 'Get stem cell by id';
    
    const stemCell_Request = await CellModel.find({_id: stemCellId})
        .then(stemCell_Response => {return  {'request type': requestType,
                                          'error': false, 
                                          'stemCell_Request': stemCell_Response
                                        }})
        .catch(error => {return {'request type': requestType,
                                 'error': true, 
                                 'message': error
                                }})
    return stemCell_Request;
};

export async function getChildCellsByStemCellId (stemCellId: string): Promise<IgetChildCellsByStemCellId> {
    const requestType = 'Get child cells by stem cell id.';

    const cells_Request = await CellModel.find({idStemCell: stemCellId})
        .then(cells_Response => {return  {'request type': requestType,
                                          'error': false, 
                                          'cells_Request': cells_Response
                                        }})
        .catch(error => {return {'request type': requestType,
                                 'error': true, 
                                 'message': error
                                }})
    return cells_Request;
};

export async function getAllIdOfChildCells (parentCellId: string): Promise<IGetAllIdOfChildCellsResp> {
    const requestType = 'get all id of childs Cells.'
    const childsIdList = await ParentsTreeOfTheCellModel.find({parentsIdList: parentCellId})
            .then(getChildsCells => {return {
                request_type: requestType,
                error: false,
                parents_tree: getChildsCells,
            }})
            .catch(error => {return {
                request_type: requestType,
                error: true,
                message: error,
            }});
    return childsIdList;
};

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

export async function newParentsTreeOfTheCell (parentsArray: string[], cell_id: string): Promise<INewParentsTreeOfTheCellResp> {
    const requestType = 'create new parents tree of the cell.'; 
    const newParentsTreeOfTheCell = new ParentsTreeOfTheCellModel({
        cellId: cell_id,
        cellLevel: parentsArray.length,
        parentsIdList: parentsArray,
    });
    const parentsTreeOfTheCellCreated = await newParentsTreeOfTheCell.save()
            .then(newParentsTreeCreated => {return {
                request_type: requestType,
                error: false,
                parents_tree: newParentsTreeCreated,
            }})
            .catch(error => {return {
                request_type: requestType,
                error: true,
                message: error,
            }});
    return parentsTreeOfTheCellCreated;
};

export async function deleteChildOfTheCell (cellId: string) {
    const childsIdList = await getAllIdOfChildCells(cellId);
    
    childsIdList.parents_tree?.map(async currentId => {
        await ParentsTreeOfTheCellModel.findByIdAndDelete(currentId._id)
            /* .then(() => { console.log('childs with stem cell in the parent tree deleted : ' + currentId._id)}) */
            .catch(error => { console.log(error) });
        await CellModel.findByIdAndDelete(currentId.cellId)
            /* .then(() => { console.log('cell childs deleted : ' + currentId.cellId)}) */
            .catch(error => { console.log(error) });
    });
};
/* __________________________________________________________ */


/* -----------------------------------------------------------
--------------- request data base --------------------------
------------------------------------------------------------ */
export async function getEcoSystemByStemCellId (stemCell_id: string, parentIsMindMap: boolean): Promise<IgetEcoSystemByStemCellId> {
    const requestType = 'Get ecosystem, to define stem cell & cells.';

    let ecosystem: IgetEcoSystemByStemCellId ;

    if (parentIsMindMap) {
        try {
            const stemCell: IgetStemCell = await getStemCellByTheMindMapId(stemCell_id);
            const cells: IgetChildCellsByStemCellId  = await getChildCellsByStemCellId(stemCell.stemCell_Request[0]?._id);

            ecosystem = {
                            'request type': requestType,
                            'error': false,
                            stemCellOfEcosystem: stemCell,
                            cellsOfEcosystem: cells,
            };
        } catch (error) {
                ecosystem = {
                                'request type': requestType,
                                'error': true, 
                                'message': error
                }
        };
    } else {
        try {
            const stemCell: IgetStemCell = await getStemCellById(stemCell_id);
            const cells: IgetChildCellsByStemCellId  = await getChildCellsByStemCellId(stemCell.stemCell_Request[0]?._id)
            ecosystem = {
                            'request type': requestType,
                            'error': false,
                            stemCellOfEcosystem: stemCell,
                            cellsOfEcosystem: cells,
            };
        } catch (error) {
                ecosystem = {'request type': requestType,
                                    'error': true, 
                                    'message': error
                }
        };        
    }
    return ecosystem
};

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

export async function addCell (cell: ICell, parentTree: string[]): Promise<INewCell> {
    const cells: IgetChildCellsByStemCellId = await getChildCellsByStemCellId(cell.idStemCell);
    const newQteCell: number = cells.cells_Request.length*2;

    for(let counter = cell.position; counter <= newQteCell; counter+=2) {
        const object = await CellModel.find({position: counter, idStemCell: cell.idStemCell});
        await CellModel.findOneAndUpdate({_id: object[0]._id}, {position: counter + 2})
            /* .then(() => console.log('cell added! : ' + object[0]._id)) */
            .catch(error => console.log('Error update cell : ' + error))
    }

    const addCell = await newCell(
        cell.title,
        cell.description,
        cell.position,
        cell.idStemCell,
        false
    );

    await newParentsTreeOfTheCell(parentTree, addCell.cellCreated._id);
    
    return addCell;
};

export async function updatePropsCellById (cellUpdated:ICell):  Promise<IUpdatePropsCellResp>  {
    const requestType = 'update props cell';
    //console.log(cellUpdated)

    const updateCell = await CellModel.findOneAndUpdate({_id: cellUpdated._id}, cellUpdated)
        .then(cellsRequest => {return {'request type': requestType,
                                        'error': false,
                                        'cells': cellsRequest
                                        }})
        .catch(error => {return {'request type': requestType,
                                    'error': true, 
                                    'message': error}}) 

    return updateCell;
}

export async function deleteCellAndAllChilds (cell_id: string, stemCell_id: string) {
    const cells: IgetChildCellsByStemCellId = await getChildCellsByStemCellId(stemCell_id);
    const cellToBeDelete = await getCellById(cell_id);
    const positionCellToBeDelete:number = await cellToBeDelete.cell[0].position;
    const qteCell: number = cells.cells_Request.length*2;
   
    for(let counter = positionCellToBeDelete; counter <= qteCell; counter+=2) {
        const object = await CellModel.find({position: counter, idStemCell: stemCell_id});
      
        await CellModel.findOneAndUpdate({_id: object[0]._id}, {position: counter - 2})
            /* .then(() => console.log('cell updated! : ' + object[0]._id)) */
            .catch(error => console.log('Error update cell : ' + error))
    };
    await CellModel.findByIdAndDelete(cellToBeDelete.cell[0]._id); 
    const parentTreeToBeDelete = await ParentsTreeOfTheCellModel.find({cellId:cellToBeDelete.cell[0]._id});
    await ParentsTreeOfTheCellModel.findByIdAndDelete(parentTreeToBeDelete[0]._id);
    await deleteChildOfTheCell(cell_id);
}
