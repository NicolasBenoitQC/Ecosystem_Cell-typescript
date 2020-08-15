// package
import 'mocha';
import { expect } from 'chai';

// Local file
import { Connect } from '../database/database';
import { CellModel, ParentsTreeOfTheCellModel } from '../database/cells/cells.model';
import { newCell } from '../database/cells/cells.helpers.methods';
import { createDefaultStemCell, updatePropsCellById, addCell, 
        getCellByProps_Id, getEcoSystemByStemCellId, deleteCellAndAllChilds } from '../database/cells/cells.methods';
import { ICell, IgetEcoSystemByStemCellId, IgetEcoSystemByMindMapId } from '../database/cells/cells.types';

const _id_MindMap = '000idMindmap000';

let _id_stemCell:string;
let parentsArray:string[];

let stemCell: ICell;
let cell1: ICell = {
    _id: '',
    title: 'Cell 1 _ unit test',
    description: 'description Cell 1 _ unit test',
    position: 2,
    stemCell: false,
    idStemCell: _id_stemCell,
};
let cell2: ICell = {
    _id: '',
    title: 'Cell 2 _ unit test',
    description: 'description Cell 2 _ unit test',
    position: 4,
    stemCell: false,
    idStemCell: _id_stemCell,
};
let cell3: ICell;
let cell3_1: ICell;

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

        expect(result.error).to.equal(false);
        expect(result.cell_created.title).to.equal('Stem Cell')
        expect(result.cell_created.description).to.equal('This is the stem cell of this mind map');
        expect(result.cell_created.position).to.equal(0);
        expect(result.cell_created.idStemCell).to.equal(_id_MindMap);
        expect(result.cell_created.stemCell).to.equal(true);
    });

    it('Update properties of the cell', async () => {

        const titleUpdated = 'update Stem Cell'
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

        const result2 = await getCellByProps_Id(stemCell._id);
        expect(result2.cell_Request[0].title).to.equal(`update ${stemCell.title}`);
    });

    it('add new cell and update the position of the cell(s) with the same stem cell', async () => {
        const newCell3 = {
            title: 'Cell 3 _ unit test',
            description: 'description Cell 3 _ unit test',
            position: 2,
            stemCell: false,
            idStemCell: stemCell._id,
        }; 
        parentsArray = [`${stemCell._id}`,];

        // ----------------------------------------------------------------
        // Create child cells to use them to verify method position update.
        const positionInitialCell1 = cell1.position; 
        const addCell1 = await newCell(
            cell1.title, cell1.description, 
            cell1.position, stemCell._id,
            cell1.stemCell
        );
        cell1 = addCell1.cell_created;

        const addCell2 = await newCell(
            cell2.title, cell2.description, 
            cell2.position, stemCell._id,
            cell2.stemCell
        );
        cell2 = addCell2.cell_created;
        // ----------------------------------------------------------------

        // check cell addition
        const addCell3 =  await addCell(newCell3, parentsArray);
        cell3 = addCell3.cell_created;
        expect(addCell3.cell_created.title).to.equal(newCell3.title);

        // check postion update
        const getCell1Updated = await getCellByProps_Id(`${addCell1.cell_created?._id}`);
        const positionCell1AfterUpdate = getCell1Updated.cell_Request[0].position;
        expect(positionCell1AfterUpdate).to.equal(positionInitialCell1+4);
    });

    it('By the mind map id get the ecosystem, to define stem cell & cell(s)', async () => {
        const result: IgetEcoSystemByMindMapId = await getEcoSystemByStemCellId(_id_MindMap, true);

        expect(result.error).to.equal(false);
        expect(result.stemCellOfEcosystem.cells_Request.length).to.equal(1);
        expect(result.cellsOfEcosystem.cells_Request.length).to.equal(3);
    });

    it('By the stem cell id get the ecosystem, to define stem cell & cell(s)', async () => {
        const newCell3_1= {
            title: 'Cell 3.1 _ unit test',
            description: 'description Cell 3.1 _ unit test',
            position: 2,
            stemCell: false,
            idStemCell: cell3._id,
        };
        parentsArray = [`${stemCell._id}`,`${cell3._id}`];

        const result1 = await newCell(
            newCell3_1.title, newCell3_1.description, 
            newCell3_1.position, newCell3_1.idStemCell,
            newCell3_1.stemCell
        );
        cell3_1 = result1.cell_created;

        const result: IgetEcoSystemByStemCellId = await getEcoSystemByStemCellId(cell3._id, false);
        expect(result.error).to.equal(false);
        expect(result.stemCellOfEcosystem.cell_Request[0].title).to.equal(cell3.title);
        expect(result.cellsOfEcosystem.cells_Request[0].title).to.equal(cell3_1.title);
    });

    it('Delete cell and delete all children of that cell. And update the position of the cell(s) with the same stem cell', async () => {
        const getInitialCell2 = await getCellByProps_Id(cell2._id);
        const positionInitialCell2 = getInitialCell2.cell_Request[0].position;
        
        await deleteCellAndAllChilds(cell3);
        
        // check cell deletion
        const result = await getEcoSystemByStemCellId(cell3._id, false);
        expect(result.stemCellOfEcosystem.cell_Request.length).to.equal(0);
        expect(result.cellsOfEcosystem.cells_Request.length).to.equal(0);
        
        // check position update
        const getAfterCell2 = await getCellByProps_Id(cell2._id);
        const positionAfterCell2 = getAfterCell2.cell_Request[0].position;
        expect(positionAfterCell2).to.equal(positionInitialCell2-2);
    });


});