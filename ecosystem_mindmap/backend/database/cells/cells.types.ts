import { Document, Model } from 'mongoose';

export interface ICell {
    
    title: string;
    description: string;
    positionId: number;
    titleOfMindMap: string;
    titleStemCell: string;
    stemCell: boolean;

};

export interface ICellDocument extends ICell, Document {

    sameTitle: (this: ICellDocument) => Promise<Document[]>;
    getTitleByIdPosition: (this: ICellDocument) => Promise<Document[]>;

};

export interface ICellModel extends Model<ICellDocument> {
    
    findOneOrCreate: (
        this: ICellModel,
        {
            title,
            description,
            positionId,
            titleOfMindMap,
            titleStemCell,
            stemCell,
    
        }: {

            title: string;
            description: string;
            positionId: number;
            titleOfMindMap: string;
            titleStemCell: string;
            stemCell: boolean;
        
        }
    ) => Promise<ICellDocument>;
    
    findByPositionId: (
        this: ICellModel,
        positionId: number
    ) => Promise<ICellDocument[]>;

    updateCell: (
        this: ICellModel,
        _idCell: number,
        cellUpdated: any
    ) => Promise<void>;

    findByStemCell: (
        this: ICellModel,
        {
            titleStemCell,
            stemCell,
        }:{
        titleStemCell: string,
        stemCell: boolean,
        }
    ) => Promise<ICellDocument[]>;

    findStemCell: (
        this: ICellModel,
        {
            titleOfMindMap,
            stemCell,
        }:{
            titleOfMindMap: string,
            stemCell: boolean,
        }
    ) => Promise<ICellDocument>;
}