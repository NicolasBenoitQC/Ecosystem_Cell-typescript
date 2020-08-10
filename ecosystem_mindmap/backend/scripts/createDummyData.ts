import  {CellModel}  from '../database/cells/cells.model';
import { Connect, disconnect } from '../database/database';

(async () => {
    //Connect();  
    
    const testCells = [
      { title: "Stem Cell", description: "This", position: 0, idMindMap: 'af46d28s', idStemCell: 'na', stemCell: true},
      { title: "Cell", description: "Tis", position: 2, idMindMap: 'af46d28s', idStemCell: 'Stem Cell', stemCell: false},
      ];

    try {
      for (const testCell of testCells) {
        await CellModel.create(testCell);
        console.log(`Created user ${testCell.title}`);
      }

      disconnect();
    } catch (e) {
      console.log(e);
    }
  })();





  /* 
  
const testCells = [
      { title: "Stem Cell DEV", description: "This is the stem cell of this mind map", positionId: 0, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'this is the main', stemCell: true},
      { title: "Emma", description: "Emma description", positionId: 2, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Valerian", description: "toto description", positionId: 4, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Laureline", description: "Jino description", positionId: 6, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Matt", description: "Matt description", positionId: 8, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Parzival", description: "Pita description", positionId: 10, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Nico", description: "Stan description", positionId: 12, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      ];


  */