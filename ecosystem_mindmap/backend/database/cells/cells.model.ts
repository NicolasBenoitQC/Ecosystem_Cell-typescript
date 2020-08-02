import * as Mongoose from 'mongoose';
import CellSchema from './cells.schema';
import ParentsTreeOfTheCellSchema from './parentsTreeOfTheCell.Schema';
import { ICellModel, IParentsTreeOfTheCellModel } from './cells.types';

export const CellModel = Mongoose.model(
    "Cell_data",
    CellSchema
) as ICellModel;

export const TestCellModel = Mongoose.model(
    "Cell_Unit_Test",
    CellSchema
) as ICellModel;

export const ParentsTreeOfTheCellModel = Mongoose.model(
    "Cell_hierarchy",
    ParentsTreeOfTheCellSchema
) as IParentsTreeOfTheCellModel;