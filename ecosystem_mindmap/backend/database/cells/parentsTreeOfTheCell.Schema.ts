import * as Mongoose from 'mongoose';

const ParentsTreeOfTheCellSchema = new Mongoose.Schema({
    cellId: {type: String, required: true},
    cellLevel: {type:Number, required: true},
    parentsIdList: {type: [String], required: true}
}, {timestamps: true});

export default ParentsTreeOfTheCellSchema;