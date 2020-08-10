// interface typing.
import { INewCell, IGetCells, ICell, IGetCellByPropsId,IgetEcoSystemByStemCellId,
        IUpdatePropsCellResp, INewParentsTreeOfTheCellResp, 
        IGetAllIdOfChildCellsResp,
     } from './cells.types';

// Local file.
import { CellModel, ParentsTreeOfTheCellModel } from './cells.model';

/* ------------------------------------------------------------
------------------ helpers functions --------------------------
------------------------------------------------------------ */

/*
    Create new cell in database.
    Model : CellModel.
unit test _ done. */
export async function newCell ( 
    title: string, description: string, position: number,
    idStemCell: string,stemCell: boolean ): Promise<INewCell> {

    const requestType = 'Create new Cell.';
    
    const newCell = new CellModel({
        title, description, position, stemCell, 
        idStemCell
    });
    
    const newCellCreated:INewCell = await newCell.save()
        .then(newCellCreated => {return {
                request_type: requestType,
                error: false, 
                cell_created: newCellCreated
            }})
        .catch(error => {return {
                request_type: requestType,
                error: true, 
                message: error
            }})
    return newCellCreated;
};

/* 
    Create parent tree of the cell in database.
    Model : ParentsTreeOfTheCellModel.
unit test _ done. */
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

/* 
    Get the cell(s) by idStemCell property specified as a parameter of this function.
    { idStemCell: id} 
    Model : CellModel.
unit test _ done. */
export async function getCellsByPropsIdStemCell (id: string): Promise<IGetCells> {
    
    const requestType = 'Get cell(s) by idStemCell.';
    
    const cells_Request = await CellModel.find({idStemCell: id})
        .then(cells_Response => {return  {
                request_type: requestType,
                error: false, 
                cells_Request: cells_Response,
            }})
        .catch(error => {return {
                request_type: requestType,
                error: true, 
                message: error
            }})
    return cells_Request;
};

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
}

/* 
    Get all document which contains the id in the parensIdList property.
    This request is used to generate the list of each document containing
    the id, the level of the cell id passed as a parameter.
    {parentsIdList: id}
    Model : ParentsTreeOfTheCellModel.
unit test _ done. */
export async function getAllIdOfChildCells (id: string): Promise<IGetAllIdOfChildCellsResp> {
    
    const requestType = 'get all id of childs Cells.'
   
    const childsIdList = await ParentsTreeOfTheCellModel.find({parentsIdList: id})
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

/* 
    Delete all children cells of the cell deleted.
    Model : CellModel.
unit test _ done. */
export async function deleteAllChildrenCellsOfTheCellDeleted (chidrenIdList: IGetAllIdOfChildCellsResp) {
    
    chidrenIdList.parents_tree.map(async currentId => {
        await CellModel.findByIdAndDelete(currentId.cellId)
            .then(deleteChildCell => {
                return {
                    request_type: `Deleted child cell ${currentId.cellId} of model CellModel.`,
                    error: false,
                    child_cell_deleted: deleteChildCell,
                }
            })
            .catch(error => {
                return {
                    request_type: `Deleted child cell ${currentId.cellId} of model CellModel.`,
                    error: true,
                    message: error,
                }
            });
    });
};

/* 
    Delete all parents trees of the children cells of the cell deleted.
    Model : ParentsTreeOfTheCellModel.
unit test _ done. */
export async function deleteAllParentsTreesOfTheCellDeleted (childrenIdList: IGetAllIdOfChildCellsResp) {
    childrenIdList.parents_tree.map(async currentId => {
        await ParentsTreeOfTheCellModel.findByIdAndDelete(currentId._id)
            .then(deleteParentTree => {
                return {
                    request_type: `Delete parent tree ${currentId._id} of model ParentsTreeOfTheCellModel.`,
                    error: false,
                    parent_tree_deleted: deleteParentTree,
                }
            })
            .catch(error => {
                return {
                    request_type: `Delete parent tree ${currentId._id} of model ParentsTreeOfTheCellModel.`,
                    error: true,
                    message: error,
                }
            });
    });
};

/* __________________________________________________________ */


/* ------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------
------------------------ function used in the socket.io communication -----------------------------------
---------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------- */

/* 
    Get ecosystem, to define stem cell & cell(s) to display.
        two possibility :
            - the first one, to define the first level of the ecosystem, the origine is the mindmap id.
            - the second, to define the next level of the ecosystem, the origine is the id an stem cell.  
 */
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
 */
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
 */
export async function addCell (cell: ICell, parentTree: string[]): Promise<INewCell> {
    
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
 */
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
 */
export async function deleteCellAndAllChilds (cell_id: string, stemCell_id: string) {
    
    const cells: IGetCells = await getCellsByPropsIdStemCell(stemCell_id);

    const cellToBeDelete: IGetCellByPropsId = await getCellByProps_Id(cell_id);

    const positionCellToBeDelete:number = cellToBeDelete.cell_Request[0].position;

    const qteCell: number = cells.cells_Request.length*2;

    for(let counter = positionCellToBeDelete; counter <= qteCell; counter+=2) {

        const currentUpdateCell = await CellModel.find({position: counter, idStemCell: stemCell_id});
      
        await CellModel.findOneAndUpdate({_id: currentUpdateCell[0]._id}, {position: counter - 2})
            .catch(error => console.log({
                    request_type: `Update position of the cell ${currentUpdateCell} when cell is add`,
                    error: true,
                    message: error,
                }))
    };

    await CellModel.findByIdAndDelete(cellToBeDelete.cell_Request[0]._id);

    const parentTreeToBeDelete = await ParentsTreeOfTheCellModel.find({cellId:cellToBeDelete.cell_Request[0]._id});
    await ParentsTreeOfTheCellModel.findByIdAndDelete(parentTreeToBeDelete[0]._id);
    
    const childrenIdList = await getAllIdOfChildCells(cell_id);
    await deleteAllChildrenCellsOfTheCellDeleted(childrenIdList);
    await deleteAllParentsTreesOfTheCellDeleted(childrenIdList);
}
