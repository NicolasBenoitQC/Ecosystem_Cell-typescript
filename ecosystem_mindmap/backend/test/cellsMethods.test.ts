// package
import { expect } from 'chai';
import 'mocha';

// Local file
import { Connect, disconnect } from '../database/database';
import {getCellsByPropsIdStemCell, getCellByProps_Id, newCell, 
    newParentsTreeOfTheCell, getAllIdOfChildCells, 
    deleteAllChildrenCellsOfTheCellDeleted,
    deleteAllParentsTreesOfTheCellDeleted,
} from '../database/cells/cells.methods';
import { ParentsTreeOfTheCellModel } from '../database/cells/cells.model';

const _id_stemCell = '5f2ebb1c62cc290fb806c999';
const _id_cell = '5f2ebba962cc290fb806c99a';

const cell2 = {
    title: 'Cell 2 _ unit test',
    description: 'description Cell 2 _ unit test',
    position: 2,
    stemCell: false,
    idStemCell: _id_stemCell,
};

const cell3 = {
    title: 'Cell 1.1 _ unit test',
    description: 'description Cell 1.1 _ unit test',
    position: 1,
    stemCell: false,
    idStemCell: _id_cell,
};

const parentsArray = [_id_stemCell, _id_cell];

describe('Methods of communication with the database.', async () => {
    before( async () => {
        await Connect();
    });
    
    after( async () => {
        await disconnect();
    });

    it.skip('Create new cell in database', async () => {
        const result = await newCell(
                                        cell2.title, cell2.description, 
                                        cell2.position, cell2.idStemCell,
                                        cell2.stemCell
                                    );
        expect(result.cell_created.title).to.equal(cell2.title);
    });

    it.skip('Create parent tree of the cell in database', async () => {
        const createCell = await newCell(
                                            cell3.title, cell3.description, 
                                            cell3.position, cell3.idStemCell,
                                            cell3.stemCell
                                        );
        const result = await newParentsTreeOfTheCell( parentsArray ,createCell.cell_created._id);

        expect(result.parents_tree.cellId).to.equal(`${createCell.cell_created._id}`);
    });

    it.skip('Get the cell(s) by idStemCell', async () => {
        const result = await getCellsByPropsIdStemCell(_id_stemCell);
        expect(result.cells_Request[0].title).to.equal('Cell 1 _ unit test');
    });

    it.skip('Get all the cells by idStemCell', async () => {
        const result = await getCellsByPropsIdStemCell(_id_stemCell);
        expect(result.cells_Request.length).to.equal(2);
    });

    it.skip('Get the cell by _id', async () => {
        const result = await getCellByProps_Id(_id_stemCell);
        expect(result.cell_Request[0].title).to.equal('Stem Cell _ unit test');
    });

    it.skip('Get all document which contains the id in the parensIdList property', async () => {
        const result = await getAllIdOfChildCells(_id_stemCell);
        expect(result.parents_tree.length).to.equal(2);
    });

    it('Delete all children cells of the cell deleted.', async () => {
        const childrenIdList = await getAllIdOfChildCells('5f30536c50057f120cc11e35'); //need to replace id
        await deleteAllChildrenCellsOfTheCellDeleted(childrenIdList);

        const result = await getCellByProps_Id(childrenIdList.parents_tree[0].cellId);
        expect(result.cell_Request.length).to.equal(0);
    });
    
    it('Delete all parents trees of the children cells of the cell deleted.', async () => {
        const childrenIdList = await getAllIdOfChildCells('5f30536c50057f120cc11e35'); // need to replace id
        await deleteAllParentsTreesOfTheCellDeleted(childrenIdList);

        const result = await ParentsTreeOfTheCellModel.find({_id: childrenIdList.parents_tree[0]._id})
        //console.log(result.length);
        expect(result.length).to.equal(0);
        // missing expect
    });

    
});
