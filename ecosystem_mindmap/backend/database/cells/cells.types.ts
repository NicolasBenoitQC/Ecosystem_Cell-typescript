import { Document, Model } from 'mongoose';

export interface ICellSchema {
    title: string;
    description: string;
    position: number;
    idStemCell: string;
    stemCell: boolean;
};

export interface ICell {
    _id: string;
    title: string;
    description: string;
    position: number;
    idStemCell: string;
    stemCell: boolean;
};

export interface INewCell {
    request_type: string;
    error:boolean;
    message?: string;
    cell_created?: ICell;
};

export interface IGetCells {
    request_type: string;
    error:boolean;
    message?: any;
    cells_Request?: ICell[];
};

export interface IGetCellByPropsId {
    request_type: string;
    error:boolean;
    message?: string;
    cell_Request?: ICell[];
}

export interface IgetEcoSystemByStemCellId {
    request_type: string;
    error:boolean;
    message?: any;
    stemCellOfEcosystem?: IGetCells;
    cellsOfEcosystem?: IGetCells;
};

export interface IUpdatePropsCellResp {
    request_type: string;
    error:boolean;
    message?: string;
    update_Cell?: ICell;
};

export interface IDeleteAllChildrenCellsOfTheCellDeleted {
    request_type: string;
    error:boolean;
    message?: string;
    child_cell_deleted?: ICell;
}

 export interface ICellDocument extends ICellSchema ,Document {
}; 

export interface ICellModel extends Model<ICellDocument> {   
};

/* ______________________________________________________________
---------------- Parents tree of the cell -----------------------
______________________________________________________________ */

export interface IParentsTreeOfTheCellSchema {
    cellId: string;
    levelCell: number;
    listPatentId: string[];
};

export interface IParentsTreeOfTheCell {
    _id: string;
    cellId: string;
    levelCell: number;
    listPatentId: string[];
};

export interface INewParentsTreeOfTheCellResp {
    request_type: string;
    error:boolean;
    message?: string;
    parents_tree?: IParentsTreeOfTheCell;
};

export interface IGetAllIdOfChildCellsResp {
    request_type: string;
    error:boolean;
    message?: string;
    parents_tree?: IParentsTreeOfTheCell[];
};



export interface IParentsTreeOfTheCellDocument extends IParentsTreeOfTheCellSchema ,Document {
};

export interface IParentsTreeOfTheCellModel extends Model<IParentsTreeOfTheCellDocument> {
};