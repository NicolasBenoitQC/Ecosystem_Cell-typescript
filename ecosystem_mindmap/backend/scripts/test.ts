import { Connect, disconnect } from '../database/database';

(async () => {
    const db: any = Connect();
    const id: any = '5edc131dab760d30dca2341e'
    const cellUpdated =
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
    const update = async () =>{ ( await db.CellModel.updateCell(id,cellUpdated))}
    await update();

    const cell = await db.CellModel.findBy_id('5edc131dab760d30dca2341e');

    const numOfCells = (await db.CellModel.find()).length;

    const bool:boolean = true;
    const stemCell = (await db.CellModel.findByStemCell(bool))

    

    console.log( {cell, stemCell});


    disconnect();
})();