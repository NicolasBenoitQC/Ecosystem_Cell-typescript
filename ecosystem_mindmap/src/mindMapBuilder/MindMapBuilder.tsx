// Framwork
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Component React
import { StemCell } from '../stemCell/StemCell';
import { Cells } from '../cells/Cells';
import { ButtonAddCell } from '../cells/ButtonAddCell';

// Local file
import './MindMapBuilder.css';
import { ENDPOINT } from '../localhost';
import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting';

// ---------------------------------------------------------------------------------------
// Object Mindmap while waiting for the "Mind Map library" page.
// --------------------------------------------------------------------------------------- 
const mindMap: MindMap[] = [{
    _id: 'af46d28s',
    title: 'Mind map DEV',
    description: 'This is the mindmap DEV for build the code',
    active: true,
}];
// _______________________________________________________________________________________
// _______________________________________________________________________________________

// ---------------------------------------------------------------------------------------
// Mind Map builder component. This is the main page for build each mind map. 
// ---------------------------------------------------------------------------------------
export const MindMapBuilder: React.FC = () => {

    // setting of the template svg.
    const [widthSvgViewBox] = useState(WidthSvgViewBox);
    const [heightSvgViewBox] = useState(HeightSvgViewBox);
    const [svgViewBoxProps] = useState(`0 0 ${widthSvgViewBox} ${heightSvgViewBox}`);

    // State variable
    const [mainStemCellId] = useState(mindMap[0]._id);
    const [cells, setCells] = useState<Cell[]>([]);
    const [stemCell, setStemCell] = useState<StemCell[]>([]);
    const [refresh, setRefresh] = useState<number>(1);
    const [parentTree, setParentTree] = useState<any[]>([]);
    
    // Effect during the first connection.
    useEffect( ():void => {
        getEcosystemToFirstConnection();
    },[]);

    // Effect to actualize cells.
    useEffect(():void => {
        getEcosystemToActualize();
    },[refresh]);

/* -------------------------------------------------------------------------------------------------
    ----- Function ---------------------------------------------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    // Function, generate the ecosystem of cells of the selected mind map during the first connection.
    const getEcosystemToFirstConnection =  ():void => {
        try {
            const socket = io.connect(ENDPOINT);
                socket.emit('get ecosystem', mainStemCellId, true , (data:any) => {
                    if (data.stemCellOfEcosystem.stemCell_Request.length === 0) {
                        socket.emit('create default stem cell', mainStemCellId, (data: any) => {
                            setStemCell([data.cellCreated]);
                            setParentTree([data.cellCreated._id]);
                        });
                    } else {
                            setStemCell(data.stemCellOfEcosystem.stemCell_Request);
                            setParentTree([data.stemCellOfEcosystem.stemCell_Request[0]._id]);
                            setCells(data.cellsOfEcosystem.cells_Request);
                    };
                });
        } catch (error) {
            console.log({
                request_type: 'function get ecosystem to first connection. TRY / CATCH',
                error: true,
                message: error,
            });
        };
    };

    // Function, refresh the ecosystem of cells to actualize the mind map.
    const getEcosystemToActualize = ():void => {
        try {
            const socket = io.connect(ENDPOINT);
                socket.emit('get ecosystem', stemCell[0]._id, false ,  (data:any) => {
                    setStemCell(data.stemCellOfEcosystem.stemCell_Request);
                    setCells(data.cellsOfEcosystem.cells_Request);
                });
        } catch (error) {
            console.log({
                request_type: 'function get ecosystem to Actualize. TRY / CATCH',
                error: true,
                message: error,
            });
        };
    };

    // Function, modify the variable 'refresh' to active the useEffect and refresh the cells.
    const refreshEcosystem =  ():void => {
        setRefresh(refresh+1);
    };

    // Function, moves the clicked cell to the center of the mind map. (cell becomes like a stem cell.)
    const doubleClick =  (cell:StemCell):void => {
        setStemCell([cell]);
        addStemCellToParentTree(cell._id);
        refreshEcosystem();
    };

    // Function, return to the parent stem cell and refresh the mind map.
    const returnPreviousStemCell =  ():void => {
        if (stemCell[0].idStemCell === mindMap[0]._id) {
            return;
        } else {
            const socket = io.connect(ENDPOINT);
            socket.emit('get cell by _id', stemCell[0].idStemCell,  (data:any) => {
                setStemCell(data.cell);
                removeStemCellToParentTree();
                refreshEcosystem();
            }) 
        }
    }

    // Function, when function double click is activate the cell id is save in the variable 'parentTree' 
    const addStemCellToParentTree =  (id:string):void => {
        parentTree.push(id);      
    };

    // Function, when button 'Previous stem cell' is activate the stem cell id is remove in the variable 'parentTree'.
    const removeStemCellToParentTree =  ():void => {
        parentTree.pop();
    };

/* ---------------------------------------------------------------------------------------------------
    ----- Elements ------------------------------------------------------------------------------------     
------------------------------------------------------------------------------------------------------ */
    
    // Stem cell element. This element is the cell at the center of the mind map.
    const listStemCell = () => {
        if (stemCell[0]) {
            return stemCell.map((currentStemCell: StemCell) => { 
                return <StemCell
                            key={currentStemCell?.position}
                            stemCellProps={currentStemCell}
                            refreshCells={refreshEcosystem}
                            returnPreviousStemCellProps={returnPreviousStemCell}
                        />
            });
        }; 
    };  

    // Cells elements. These element are the cells around the center cell of the mind map.
    const listCells = () => {
        return cells.map((currentCell: Cell) => {
             return <Cells
                    key={currentCell.position}
                    cellProps={currentCell}
                    quantityCells={cells.length}
                    actionDoubleClick={doubleClick} 
                />
        }); 
    };

    // Buttons add elements. These elements are the buttons + between the cells.
    const listbuttonAddCell = () => {
        if (cells.length === 0) {
            return <ButtonAddCell
                key={1}
                position={2}
                quantityCells={cells.length+2}
                stemCellProps={stemCell}
                noCell={true}
                cellProps={cells[0]}
                refreshCells={refreshEcosystem}
                parentTreeProps={parentTree}
            />
        } else {
            return cells.map((currentCell: Cell) => {
                return <ButtonAddCell
                        key={currentCell.position}
                        position={currentCell.position}
                        quantityCells={cells.length}
                        stemCellProps={stemCell}
                        noCell={false}
                        cellProps= {currentCell}
                        refreshCells={refreshEcosystem}
                        parentTreeProps={parentTree}
                    />
            });
        };
    };

/* ---------------------------------------------------------------------------------------------------
    ------------- Render -----------------------------------------------------------------------------    
------------------------------------------------------------------------------------------------------ */
    return (
        <div className='mind-map-builder-container'>
            <div className='svg-container'  >
                <svg 
                    className='svg-content' 
                    version='1.1' 
                    viewBox={svgViewBoxProps}
                >
                    {listStemCell()}
                    {listCells()}
                    {listbuttonAddCell()}
                </svg>
            </div>

            <div>
                <button onClick={returnPreviousStemCell}>
                    Previous stem cell
                </button>
            </div>
        </div>
    );
};