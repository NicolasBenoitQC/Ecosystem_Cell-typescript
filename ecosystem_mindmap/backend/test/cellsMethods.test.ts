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
import { CellModel, ParentsTreeOfTheCellModel } from '../database/cells/cells.model';

const _id_MindMap = '5f2ebb1c62cc290fb806c999';
let _id_stemCell:string;
let _id_cell1:string;
let _id_cell2:string;
let parentsArray:string[];

const stemCell = {
    title: 'Stem Cell _ unit test',
    description: 'description Stem Cell _ unit test',
    position: 0,
    stemCell: true,
    idStemCell: _id_MindMap,
};

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
        await ParentsTreeOfTheCellModel.deleteMany({});
        await CellModel.deleteMany({});
    });
    
    after( async () => {
        await disconnect();
    });

    /* it.only('clean', async () => {
        
    }) */

    it('Create new cell in database', async () => {
        const result = await newCell(
                                        stemCell.title, stemCell.description, 
                                        stemCell.position, stemCell.idStemCell,
                                        stemCell.stemCell
                                    );
        expect(result.cell_created.title).to.equal(stemCell.title);

        _id_stemCell = result.cell_created._id;
    });

    it('Create parent tree of the cell in database', async () => {
        const createCell = await newCell(
                                            cell1.title, cell1.description, 
                                            cell1.position, _id_stemCell,
                                            cell1.stemCell
                                        );

        _id_cell1 = `${createCell.cell_created._id}`;
        //parentsArray = [`${_id_stemCell}`];

        const result = await newParentsTreeOfTheCell( [`${_id_stemCell}`] , `${createCell.cell_created._id}`);

        expect(result.parents_tree.cellId).to.equal(`${createCell.cell_created?._id}`);
    });

    it('Get cell(s) by idStemCell', async () => {
        const result = await getCellsByPropsIdStemCell(`${_id_stemCell}`);
        expect(result.cells_Request[0].title).to.equal('Cell 1 _ unit test');
    });

    it('Get all the cells by idStemCell', async () => {
        const createCell = await newCell(
                                            cell2.title, cell2.description, 
                                            cell2.position, _id_stemCell,
                                            cell2.stemCell
        );

        _id_cell2 = `${createCell.cell_created._id}`;
        //parentsArray = [`${_id_stemCell}`];

        await newParentsTreeOfTheCell( [`${_id_stemCell}`] , `${createCell.cell_created._id}`);

        const result = await getCellsByPropsIdStemCell(`${_id_stemCell}`);
        expect(result.cells_Request.length).to.equal(2); 
    });

    it('Get the cell by _id', async () => {
        const result = await getCellByProps_Id(`${_id_stemCell}`);
        expect(result.cell_Request[0].title).to.equal('Stem Cell _ unit test');
    });

    it('Get all document which contains the id in the parensIdList property', async () => {
        const result = await getAllIdOfChildCells(`${_id_stemCell}`);
        expect(result.parents_tree.length).to.equal(2);
    });

    it('Delete all children cells of the cell deleted.', async () => {

        const childrenIdList = await getAllIdOfChildCells(`${_id_stemCell}`);
        await deleteAllChildrenCellsOfTheCellDeleted(childrenIdList);

        const result = await getCellByProps_Id(childrenIdList.parents_tree[0].cellId);
        expect(result.cell_Request.length).to.equal(0);
    });
    
    it('Delete all parents trees of the children cells of the cell deleted.', async () => {
        const childrenIdList = await getAllIdOfChildCells(`${_id_stemCell}`);
        await deleteAllParentsTreesOfTheCellDeleted(childrenIdList);

        const result = await ParentsTreeOfTheCellModel.find({_id: childrenIdList.parents_tree[0]._id})
        expect(result.length).to.equal(0);
    });

    
});
