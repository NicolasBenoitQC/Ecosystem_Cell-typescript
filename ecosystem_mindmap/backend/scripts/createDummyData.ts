import { CellModel } from '../database/cells/cells.model';
import { Connect, disconnect } from '../database/database';

(async () => {
    Connect();  
    
    const cells = [
      { title: "Stem Cell DEV", description: "This is the stem cell of this mind map", positionId: 0, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'this is the main', stemCell: true},
      { title: "Emma", description: "Emma description", positionId: 2, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Valerian", description: "toto description", positionId: 4, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Laureline", description: "Jino description", positionId: 6, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Matt", description: "Matt description", positionId: 8, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Pita", description: "Pita description", positionId: 10, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      { title: "Stan", description: "Stan description", positionId: 12, titleOfMindMap: 'Dev Mind Map', titleStemCell: 'Stem Cell DEV', stemCell: false},
      ];

    try {
      for (const cell of cells) {
        await CellModel.create(cell);
        console.log(`Created user ${cell.title}`);
      }

      disconnect();
    } catch (e) {
      console.log(e);
    }
  })();