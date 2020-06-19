import { CellModel } from './cells.model';

export async function getAllCells () {
    const cells = await CellModel.find({stemCell: false})

    /* need to understand callback
    
    const cells = await CellModel.find({stemCell: false}, function (error, cells) {
        if (error) return handleError(error);
        console.log('All cells obtained')
    }) 

    or this methode
    .then(cells => {console.log(cells);})
    .catch(error => console.log('Error to get all cells : ' + error))
    */
    return cells
}

export async function deleteCellById (cell_id: string) {
    const cells:any = await getAllCells();

    const cellToBeDelete:any = await CellModel.find({_id: cell_id});

    const idPositionToBeDelete:any = await cellToBeDelete[0].positionId
    const qteCell = cells.length*2

    for(let i = idPositionToBeDelete; i <= qteCell; i+=2) {
       const object = await CellModel.find({positionId: i});
       await CellModel.findById(object[0]._id)
        .then(cell => {
              cell.positionId = Number(i -2)
            cell.save()    
          }) 
          .catch(error => console.log('error to update cell with new positionId' + error))
    }
    await CellModel.findByIdAndDelete(cellToBeDelete[0]._id); 
};

export async function addCellInThisPosition (positionIdOfNewCell: number) {
    const cells:any = await getAllCells();
    const qteCell = cells.length*2;
    const title = 'New Cell added';
    const description = '';
    const positionId = positionIdOfNewCell;
    const stemCell = false;
    const titleStemCell = 'Stem Cell DEV';
    const titleOfMindMap = 'Dev Mind Map';

    console.log('add cell in this position');
    for(let i = positionIdOfNewCell; i <= qteCell; i+=2) {
        const object = await CellModel.find({positionId: i});        
        await CellModel.findById(object[0]._id)
         .then(cell => {
               cell.positionId = Number(i +2)
             cell.save()    
           })
           .catch(error => console.log('error to update cell with new positionId' + error))
     }
    const newCell = new CellModel({
        title, description, positionId, stemCell, 
        titleStemCell, titleOfMindMap
    });
    await newCell.save()

};
