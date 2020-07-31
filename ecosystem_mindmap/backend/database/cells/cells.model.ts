import * as Mongoose from 'mongoose';
import CellSchema from './cells.schema';
import CellHierarchySchema from './cellHierarchy.shema';
import { ICellModel, ICellHierarchyModel } from './cells.types';

export const CellModel = Mongoose.model(
    "Cell_data",
    CellSchema
) as ICellModel;

export const TestCellModel = Mongoose.model(
    "Cell_Unit_Test",
    CellSchema
) as ICellModel;

export const CellHierarchyModel = Mongoose.model(
    "Cell_hierarchy",
    CellHierarchySchema
) as ICellHierarchyModel;