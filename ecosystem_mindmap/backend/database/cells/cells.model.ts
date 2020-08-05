import * as Mongoose from 'mongoose';
import CellSchema from './cells.schema';
import ParentsTreeOfTheCellSchema from './parentsTreeOfTheCell.Schema';
import { ICellModel, IParentsTreeOfTheCellModel } from './cells.types';

export const CellModel = Mongoose.model(
    "cells_properties",
    CellSchema
) as ICellModel;

export const TestCellModel = Mongoose.model(
    "cells_properties_Unit_Test",
    CellSchema
) as ICellModel;

export const ParentsTreeOfTheCellModel = Mongoose.model(
    "cells_tree",
    ParentsTreeOfTheCellSchema
) as IParentsTreeOfTheCellModel;