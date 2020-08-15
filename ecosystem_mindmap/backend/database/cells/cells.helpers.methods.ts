// interface typing.
import { INewCell, IGetCells,
        INewParentsTreeOfTheCellResp, 
        IGetAllIdOfChildCellsResp,
        IParentsTreeOfTheCellSchema,
        IParentsTreeOfTheCell,
        IParentsTreeOfTheCellDocument,
 } from './cells.types';

// Local file.
import { CellModel, ParentsTreeOfTheCellModel } from './cells.model';

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

const newParentsTreeOfTheCell: IParentsTreeOfTheCellDocument  = new ParentsTreeOfTheCellModel({
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
