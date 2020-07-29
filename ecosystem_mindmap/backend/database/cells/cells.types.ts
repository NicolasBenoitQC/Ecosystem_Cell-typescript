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

export interface IgetStemCellByTheMindMapIdRes {
    "request type": string;
    error:boolean;
    message?: any;
    stemCell_Request?: ICell;
};

export interface IgetStemCell {
    "request type": string;
    error:boolean;
    message?: any;
    stemCell_Request?: ICell[];
};

export interface IgetChildCellsByStemCellId {
    "request type": string;
    error:boolean;
    message?: any;
    cells_Request?: ICell[];
};

export interface IgetEcoSystemByStemCellId {
    "request type": string;
    error:boolean;
    message?: any;
    stemCellOfEcosystem?: IgetStemCell;
    cellsOfEcosystem?: IgetChildCellsByStemCellId;
};

export interface IGetStemCellResp {
    "request type": string;
    error:boolean;
    message?: any;
    stemCell?: ICell[];
};

export interface IGetCellsByStemCellResp {
    "request type": string;
    error:boolean;
    message?: string;
    cells?: ICell[];
};

export interface IGetCellByIdResp {
    "request type": string;
    error:boolean;
    message?: string;
    cell?: ICell[];
}

export interface INewCell {
    "request type": string;
    error:boolean;
    message?: string;
    cellCreated?: ICell;
};

export interface IUpdatePropsCellResp {
    "request type": string;
    error:boolean;
    message?: string;
    cellCreated?: ICell;
};

 export interface ICellDocument extends ICellSchema ,Document {
}; 

export interface ICellModel extends Model<ICellDocument> {
    
};