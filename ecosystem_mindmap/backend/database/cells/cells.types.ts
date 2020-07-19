import { Document, Model } from 'mongoose';

export interface ICell {
    _id: string;
    title: string;
    description: string;
    position: number;
    idStemCell: string;
    stemCell: boolean;
};

export interface IGetStemCellResp {
    "request type": string;
    error:boolean;
    message?: string;
    stemCell?: ICell[];
};

export interface IGetCellsResp {
    "request type": string;
    error:boolean;
    message?: string;
    cells?: ICell[];
};

export interface INewCell {
    "request type": string;
    error:boolean;
    message?: string;
    cellCreated?: ICell;
};

 export interface ICellDocument extends Document {

}; 

export interface ICellModel extends Model<ICellDocument> {
    
};