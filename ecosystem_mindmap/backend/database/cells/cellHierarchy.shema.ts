import * as Mongoose from 'mongoose';

const CellHierarchySchema = new Mongoose.Schema({
    cell: {type: String},
    parents: {type: String},
}, {timestamps: true});

export default CellHierarchySchema;