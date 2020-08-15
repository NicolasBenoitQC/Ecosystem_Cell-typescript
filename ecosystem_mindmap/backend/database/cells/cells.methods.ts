// interface typing.
import { INewCell, IGetCells, ICell, IGetCellByPropsId,IgetEcoSystemByStemCellId,
        IUpdatePropsCellResp,
        ICellSchema
     } from './cells.types';

// Local file.
import { CellModel, ParentsTreeOfTheCellModel } from './cells.model';
import { newCell, getCellsByPropsIdStemCell, newParentsTreeOfTheCell, 
        getAllIdOfChildCells, deleteAllChildrenCellsOfTheCellDeleted,
        deleteAllParentsTreesOfTheCellDeleted
} from './cells.helpers.methods'

/* 
    Get the cell with the _id property specified as a parameter of this function.
    { _id: id} 
    Model : CellModel.
    Function also used in socket.io communication.
unit test _ done. */
export async function getCellByProps_Id (id: string): Promise<IGetCellByPropsId> {
    
    const requestType = 'Get cell by _id';

    const cells_Request = await CellModel.find({_id: id})
        .then(cells_Response => {return {
                request_type: requestType,
                error: false,
                cell_Request: cells_Response
            }})
        .catch(error => {return {
                request_type: requestType,
                error: true, 
                message: error
            }})
    return cells_Request;
};

/* 
    Get ecosystem, to define stem cell & cell(s) to display.
        two possibility :
            - the first one, to define the first level of the ecosystem, the origine is the mindmap id.
            - the second, to define the next level of the ecosystem, the origine is the id an stem cell.  
unit test _ done. */
export async function getEcoSystemByStemCellId (stemCell_id: string, parentIsMindMap: boolean): Promise<IgetEcoSystemByStemCellId> {
    
    const requestType = 'Get ecosystem, to define stem cell & cells.';

    let ecosystem: IgetEcoSystemByStemCellId ;

    if (parentIsMindMap) {
        try {
            const stemCell: IGetCells = await getCellsByPropsIdStemCell(stemCell_id);
            const cells: IGetCells  = await getCellsByPropsIdStemCell(stemCell.cells_Request[0]?._id);

            ecosystem = {
                            request_type: requestType,
                            error: false,
                            stemCellOfEcosystem: stemCell,
                            cellsOfEcosystem: cells,
            };
        } catch (error) {
                ecosystem = {
                                request_type: requestType,
                                error: true, 
                                message: error
                }
        };
    } else {
        try {
            const stemCell: IGetCellByPropsId = await getCellByProps_Id(stemCell_id);
            const cells: IGetCells  = await getCellsByPropsIdStemCell(stemCell.cell_Request[0]?._id)
            ecosystem = {
                            request_type: requestType,
                            error: false,
                            stemCellOfEcosystem: stemCell,
                            cellsOfEcosystem: cells,
            };
        } catch (error) {
                ecosystem = {
                                request_type: requestType,
                                error: true, 
                                message: error
                }
        };        
    }
    return ecosystem
};

/* 
    Create default stem cell. 
    If the mind map is empty this function is call.
unit test _ done. */
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

/* 
    Add new cell and update the position of the cell(s) with the same stem cell.
    Add parent tree of the cell added.
unit test _ done. */
export async function addCell (cell: ICellSchema, parentTree: string[]): Promise<INewCell> {
    
    const cells: IGetCells = await getCellsByPropsIdStemCell(cell.idStemCell);
    
    const newQteCell: number = cells.cells_Request.length*2;

    for(let counter = cell.position; counter <= newQteCell; counter+=2) {
        
        const currentUpdateCell: ICell[] = await CellModel.find({position: counter, idStemCell: cell.idStemCell});
        
        await CellModel.findOneAndUpdate({_id: currentUpdateCell[0]._id}, {position: counter + 2})
            .catch(error => console.log({
                    request_type: `Update position of the cell ${currentUpdateCell} when cell is add`,
                    error: true,
                    message: error,
                }));
    };

    const addCell = await newCell(
        cell.title,
        cell.description,
        cell.position,
        cell.idStemCell,
        false
    );

    await newParentsTreeOfTheCell(parentTree, addCell.cell_created._id);
    
    return addCell;
};

/* 
    Update properties of the cell.
    If title or description is changed, this function is call.
unit test _ done. */
export async function updatePropsCellById (cellUpdated:ICell):  Promise<IUpdatePropsCellResp>  {
    
    const requestType = 'update props cell';

    const updateCell: IUpdatePropsCellResp = await CellModel.findOneAndUpdate({_id: cellUpdated._id}, cellUpdated)
        .then(updatedCell => {return {request_type: requestType,
                                       error: false,
                                       update_Cell: updatedCell
                                    }})
        .catch(error => {return {request_type: requestType,
                                 error: true, 
                                 message: error
                                }}) 

    return updateCell;
}

/* 
    Delete cell and delete all children of that cell.
    The position of the cell(s) with the same stem cell are updated.
unit test _ done. */
export async function deleteCellAndAllChilds (cellToBeDelete: ICell) {

    // get all cells whit the same stem cell.
    const cells: IGetCells = await getCellsByPropsIdStemCell(cellToBeDelete.idStemCell);

    const positionCellToBeDelete:number = cellToBeDelete.position;

    const qteCell: number = cells.cells_Request.length*2;

    // if cellToBeDelete is the main stem cell, the position of the sisters cells are not updated.
    // else the position of the sisters cell are updated.
    if(!cellToBeDelete.stemCell) {
        for(let counter = positionCellToBeDelete; counter <= qteCell; counter+=2) {

            const currentUpdateCell = await CellModel.find({position: counter, idStemCell: cellToBeDelete.idStemCell});
          
            await CellModel.findOneAndUpdate({_id: currentUpdateCell[0]._id}, {position: counter - 2})
                .catch(error => console.log({
                        request_type: `Update position of the cell ${currentUpdateCell} when cell is add`,
                        error: true,
                        message: error,
                    }))
        };
    }

    await CellModel.findByIdAndDelete(cellToBeDelete._id);

    const parentTreeToBeDelete = await ParentsTreeOfTheCellModel.find({cellId: cellToBeDelete._id});
    if(parentTreeToBeDelete.length > 0) {
        await ParentsTreeOfTheCellModel.findByIdAndDelete(parentTreeToBeDelete[0]._id);
    };

    // delete all children of the cellToBeDeleted.
    const childrenIdList = await getAllIdOfChildCells(cellToBeDelete._id);
    await deleteAllChildrenCellsOfTheCellDeleted(childrenIdList);
    await deleteAllParentsTreesOfTheCellDeleted(childrenIdList);
}



