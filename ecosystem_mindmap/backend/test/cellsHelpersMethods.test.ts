// package
import 'mocha';
import { expect } from 'chai';

// Local file
import { Connect } from '../database/database';
import { CellModel, ParentsTreeOfTheCellModel } from '../database/cells/cells.model';
import { getCellByProps_Id } from '../database/cells/cells.methods';
import {getCellsByPropsIdStemCell, newCell, 
        newParentsTreeOfTheCell, getAllIdOfChildCells, 
        deleteAllChildrenCellsOfTheCellDeleted,
        deleteAllParentsTreesOfTheCellDeleted,
                            } from '../database/cells/cells.helpers.methods';
import { ICell } from '../database/cells/cells.types';

const _id_MindMap = '5f2ebb1c62cc290fb806c999';
let _id_cell2:string;
let parentsArray:string[];

let stemCell: ICell = {
    _id: '',
    title: 'Stem Cell _ unit test',
    description: 'description Stem Cell _ unit test',
    position: 0,
    stemCell: true,
    idStemCell: _id_MindMap,
};

let cell1: ICell = {
    _id: '',
    title: 'Cell 1 _ unit test',
    description: 'description Cell 1 _ unit test',
    position: 2,
    stemCell: false,
    idStemCell: stemCell._id,
};

let cell2: ICell = {
    _id: '',
    title: 'Cell 2 _ unit test',
    description: 'description Cell 2 _ unit test',
    position: 4,
    stemCell: false,
    idStemCell: stemCell._id,
};

describe('Helpers methods of communication with the database.', async () => {
    before( async () => {
        await Connect('UnitTestCellsMindMap');
        await ParentsTreeOfTheCellModel.deleteMany({});
        await CellModel.deleteMany({});
    });
    
    after( async () => {
        await ParentsTreeOfTheCellModel.deleteMany({});
        await CellModel.deleteMany({});
    });

    it('Create new cell in database', async () => {
        const result = await newCell(
                                        stemCell.title, stemCell.description, 
                                        stemCell.position, stemCell.idStemCell,
                                        stemCell.stemCell
                                    );
                                    
        expect(result.cell_created.title).to.equal(stemCell.title);
        
        // update stemCell after expect.
        stemCell = result.cell_created;
    });

    it('Create parent tree of the cell in database', async () => {
        const createCell = await newCell(
                                            cell1.title, cell1.description, 
                                            cell1.position, stemCell._id,
                                            cell1.stemCell
                                        );
        cell1 = createCell.cell_created;
        parentsArray = [stemCell._id];

        const result = await newParentsTreeOfTheCell( parentsArray , cell1._id);
        expect(result.error).to.equal(false);
        expect(result.parents_tree.parentsIdList[0]).to.equal(`${stemCell._id}`);
        expect(result.parents_tree.cellLevel).to.equal(parentsArray.length)
        expect(result.parents_tree.cellId).to.equal(`${cell1._id}`);
    });

    it('Get cell(s) by idStemCell', async () => {
        const result = await getCellsByPropsIdStemCell(stemCell._id);
        expect(result.error).to.equal(false);
        expect(result.cells_Request[0]._id).to.eql(cell1._id);
        expect(result.cells_Request[0].title).to.equal(cell1.title);
        expect(result.cells_Request[0].description).to.equal(cell1.description);
        expect(result.cells_Request[0].position).to.equal(cell1.position);
        expect(result.cells_Request[0].idStemCell).to.equal(cell1.idStemCell);              
        expect(result.cells_Request[0].stemCell).to.equal(cell1.stemCell);
    });

    it('Get all the cells by idStemCell', async () => {
        const createCell = await newCell(
                                            cell2.title, cell2.description, 
                                            cell2.position, stemCell._id,
                                            cell2.stemCell
        );

        _id_cell2 = `${createCell.cell_created._id}`;

        await newParentsTreeOfTheCell( [`${stemCell._id}`] , `${createCell.cell_created._id}`);

        const result = await getCellsByPropsIdStemCell(`${stemCell._id}`);
        expect(result.cells_Request.length).to.equal(2); 
    });

    it('Get the cell by _id', async () => {
        const result = await getCellByProps_Id(`${stemCell._id}`);
        expect(result.cell_Request[0].title).to.equal('Stem Cell _ unit test');
    });

    it('Get all document which contains the id in the parensIdList property', async () => {
        const result = await getAllIdOfChildCells(`${stemCell._id}`);
        expect(result.parents_tree.length).to.equal(2);
    });

    it('Delete all children cells of the cell deleted.', async () => {

        const childrenIdList = await getAllIdOfChildCells(`${stemCell._id}`);
        await deleteAllChildrenCellsOfTheCellDeleted(childrenIdList);

        const result = await getCellByProps_Id(childrenIdList.parents_tree[0].cellId);
        expect(result.cell_Request.length).to.equal(0);
    });
    
    it('Delete all parents trees of the children cells of the cell deleted.', async () => {
        const childrenIdList = await getAllIdOfChildCells(`${stemCell._id}`);
        await deleteAllParentsTreesOfTheCellDeleted(childrenIdList);

        const result = await ParentsTreeOfTheCellModel.find({_id: childrenIdList.parents_tree[0]._id})
        expect(result.length).to.equal(0);
    });
});


