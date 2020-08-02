import { Connect, disconnect } from '../database/database';
//import { addCellHierarchy } from '../database/cells/cells.methods'
import { ParentsTreeOfTheCellModel } from '../database/cells/cells.model'


(async () => {

  Connect()

  const add = async(array:string[], cell_Id: string) => {  
    
    const newCellHierarchy = new ParentsTreeOfTheCellModel({
      cellId: cell_Id,
      cellLevel: array.length,
      parentsIdList: array,
    });
    const newCreated:any = await newCellHierarchy.save()
      .then(newCellCreated => {return {'request type': 'create new Cell',
                                      'error': false, 
                                      cellCreated: newCellCreated
      }})
      .catch(error => {return {'request type': 'create new Cell',
                              'error': true, 
                              'message': error
      }})
    console.log(newCreated)
    


    /* for (let counter:number = 0 ; counter !==  array.length; counter++)  {
      const newCellHierarchy = new ParentsTreeOfTheCellModel({
        cell: cellId,
        parents: array[counter],
        levelParent:counter,
        levelCell: array.length + 1
      });
      const newCreated:any = await newCellHierarchy.save()
        .then(newCellCreated => {return {'request type': 'create new Cell',
                                        'error': false, 
                                        cellCreated: newCellCreated
        }})
        .catch(error => {return {'request type': 'create new Cell',
                                'error': true, 
                                'message': error
        }})
      console.log(newCreated);
    }; */
  };

  
  const finding = async (stemCell:string) => {
    const find: any =  await ParentsTreeOfTheCellModel.find({listPatentId: stemCell})
        .then(newCellCreated => {return {'request type': 'create new Cell',
                                        'error': false, 
                                        cellCreated: newCellCreated
        }})
        .catch(error => {return {'request type': 'create new Cell',
                                'error': true, 
                                'message': error
        }})
    console.log(find)

    await find.cellCreated.map((currentCell:any) => {
      console.log(currentCell.listPatentId)
      console.log(currentCell.cellId)
      console.log(currentCell._id)
    })
  };
  const stemCelll = 'cell3'
   /* 
   const cellid1 = 'idCellChild1'
  const arrays1 = ['cell1','cell3','cell12','cell16']
  
  const cellid2 = 'idCellChild2'
  const arrays2 = ['cell1','cell3','cell12','cell19']
  
  const cellid3 = 'idCellChild3'
  const arrays3 = ['cell1','cell5','cell6']
  
  const cellid4 = 'idCellChild4'
  const arrays4 = ['cell1','cell2','cell20']

  await add(arrays1,cellid1);
  await add(arrays2,cellid2);
  await add(arrays3,cellid3);
  await add(arrays4,cellid4);  
  */
  await finding (stemCelll)
  disconnect()
})();


























  //Connect();
   // const id: any = '5edc131dab760d30dca2341e'
    /* const cellUpdated =
        {
          _id: '5edc131dab760d30dca2341e',
          title: 'Emmbbbbbb',
          description: 'Emma description',
          positionId: 1,
          titleOfMindMap: 'Dev Mind Map',
          titleStemCell: 'Stem Cell DEV',
          stemCell: false,
        }
 
    // test static methods
    //const update = async () =>{ ( await db.CellModel.updateCell(id,cellUpdated))}
    //await update();

    //const cell = await db.CellModel.find('5edc131dab760d30dca2341e');

    //const numOfCells = (await db.CellModel.find()).length;

    const bool:boolean = true;
    const stemCell = (await db.CellModel.findByStemCell(bool))

    

    console.log({stemCell});

*/    