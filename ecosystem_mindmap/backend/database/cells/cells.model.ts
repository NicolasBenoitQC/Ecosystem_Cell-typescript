import * as Mongoose from 'mongoose';
import CellSchema from './cells.schema';
import { ICellDocument, ICellModel } from './cells.types';

export const CellModel = Mongoose.model<ICellDocument>(
    "cell",
    CellSchema
) as ICellModel;