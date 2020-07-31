import { Connect, disconnect } from '../database/database';
//import { addCellHierarchy } from '../database/cells/cells.methods'
import { CellHierarchyModel } from '../database/cells/cells.model'


(async () => {
  /* const cellid = '655436sdg79dfiljhjkh'
  const array = ['cell10','cell4']

  array.map(async (currentCell: any) => {
    Connect()
    const newCellHierarchy = new CellHierarchyModel({cell: cellid, parents: currentCell});

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
      disconnect();
  }) */

  await Connect()

  const find: any =  await CellHierarchyModel.find({parents: 'cell4'})
      .then(newCellCreated => {return {'request type': 'create new Cell',
                                      'error': false, 
                                      cellCreated: newCellCreated
      }})
      .catch(error => {return {'request type': 'create new Cell',
                              'error': true, 
                              'message': error
      }})

  console.log(find)
  console.log(find.cellCreated.length)

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