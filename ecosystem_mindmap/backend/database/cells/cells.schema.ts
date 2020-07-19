import * as Mongoose from 'mongoose';

const CellSchema = new Mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String },
        position: { type: Number, required: true },
        idStemCell: { type: String, required: true },
        stemCell: { type: Boolean, required: true }
}, {timestamps: true});

export default CellSchema;



















/* JMA ca ne fonctionne plus en utilisant juste le typage et comment gerer required.

const CellSchema = new Mongoose.Schema(ICell, {timestamps: true});

*/


//import { findAllCells, findCellBy_id, findStemCell,updateCell,findByStemCell } from './cells.statics';

// Static methodes   JMA c'est quoi methodes static    ?????????.
/* CellSchema.statics.findAllCells = findAllCells;
CellSchema.statics.findCellBy_id = findCellBy_id;
CellSchema.statics.findStemCell = findStemCell;
CellSchema.statics.updateCell = updateCell;
CellSchema.statics.findByStemCell = findByStemCell; */