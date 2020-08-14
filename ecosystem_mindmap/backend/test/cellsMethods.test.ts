// package
import 'mocha';
import { expect } from 'chai';

// Local file
import { Connect } from '../database/database';
import { CellModel, ParentsTreeOfTheCellModel } from '../database/cells/cells.model';
import { newCell } from '../database/cells/cells.helpers.methods';
import { createDefaultStemCell, updatePropsCellById, addCell, getCellByProps_Id } from '../database/cells/cells.methods';
import { ICell } from '../database/cells/cells.types';

const _id_MindMap = '000idMindmap000';
let _id_stemCell:string;
let _id_cell1:string;
let _id_cell2:string;
let stemCell: ICell;
let parentsArray:string[];

const cell1 = {
    title: 'Cell 1 _ unit test',
    description: 'description Cell 1 _ unit test',
    position: 2,
    stemCell: false,
    idStemCell: _id_stemCell,
};

const cell2 = {
    title: 'Cell 2 _ unit test',
    description: 'description Cell 2 _ unit test',
    position: 4,
    stemCell: false,
    idStemCell: _id_stemCell,
};




describe('Methods of communication with the database.', async () => {
    before( async () => {
        await Connect('UnitTestCellsMindMap');
        await CellModel.deleteMany({});
        await ParentsTreeOfTheCellModel.deleteMany({});
       
    });

    after( async () => {
        await CellModel.deleteMany({});
        await ParentsTreeOfTheCellModel.deleteMany({});
    });

    it('Create default stem cell', async () => {
        const result = await createDefaultStemCell(_id_MindMap);
        stemCell = result.cell_created;
        _id_stemCell = result.cell_created._id;
        expect(result.error).to.equal(false);
        expect(result.cell_created.description).to.equal('This is the stem cell of this mind map');
    });

    it('Update properties of the cell', async () => {
        const titleUpdated = 'update stem Cell'
        const updateStemCell:ICell = {
            _id: stemCell._id,
            title: titleUpdated,
            description: stemCell.description,
            position: stemCell.position,
            idStemCell: stemCell.idStemCell,
            stemCell: stemCell.stemCell,
        };
        const result = await updatePropsCellById(updateStemCell);
        expect(result.error).to.equal(false);   
    });

    it('add new cell and update the position of the cell(s) with the same stem cell', async () => {
        const cell3 = {
            title: 'Cell 3 _ unit test',
            description: 'description Cell 3 _ unit test',
            position: 2,
            stemCell: false,
            idStemCell: _id_stemCell,
        };
        parentsArray = [`${_id_stemCell}`,];
        const positionInitialCell1 = cell1.position; 
        const result1 = await newCell(
            cell1.title, cell1.description, 
            cell1.position, _id_stemCell,
            cell1.stemCell
        );
        _id_cell1 = result1.cell_created?._id;
        const result2 = await newCell(
            cell2.title, cell2.description, 
            cell2.position, _id_stemCell,
            cell2.stemCell
        );
        _id_cell2 = result2.cell_created?._id;
        const result =  await addCell(cell3, parentsArray);
        const getCell1Updated = await getCellByProps_Id(`${result1.cell_created?._id}`);
        const positionCell1AfterUpdate = getCell1Updated.cell_Request[0].position;
        expect(result.cell_created.title).to.equal(cell3.title);
        expect(positionCell1AfterUpdate).to.equal(positionInitialCell1+4)
    });
});