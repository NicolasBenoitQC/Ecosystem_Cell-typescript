import * as Mongoose from 'mongoose';
import { findAllCells, findCellBy_id, findStemCell,updateCell,findByStemCell } from './cells.statics';
import { sametitle, getTitleByIdPosition } from './cells.methods';

const CellSchema = new Mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    positionId: { type: Number, required: true },
    titleOfMindMap: { type: String, required: true },
    titleStemCell: { type: String, required: true },
    stemCell: { type: Boolean, required: true }
}, {timestamps: true});


// Static methodes.
CellSchema.statics.findAllCells = findAllCells;
CellSchema.statics.findCellBy_id = findCellBy_id;
CellSchema.statics.findStemCell = findStemCell;
CellSchema.statics.updateCell = updateCell;
CellSchema.statics.findByStemCell = findByStemCell;

// Instance methodes.
CellSchema.methods.sametitle = sametitle;
CellSchema.methods.getTitleByIdPosition = getTitleByIdPosition;

export default CellSchema;