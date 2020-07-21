import './MindMapBuilder.css';
import React, { useState, useEffect } from 'react';
import { StemCells } from '../stemCells/StemCells';
import { Cells } from '../cells/Cells';
import { ButtonAddCell } from '../cells/ButtonAddCell';
import { ENDPOINT } from '../localhost';
import io from 'socket.io-client';
import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting';

export const MindMapBuilder: React.FC = () => {
    const [mainStemCellId, setMainStemCellId] = useState('af46d28s')
    const [cells, setCells] = useState<Cell[]>([]);
    const [stemCell, setStemCell] = useState<StemCell[]>([]);
    const [widthSvgViewBox] = useState(WidthSvgViewBox);
    const [heightSvgViewBox] = useState(HeightSvgViewBox);
    const [svgViewBoxProps] = useState(`0 0 ${widthSvgViewBox} ${heightSvgViewBox}`);

    useEffect( () => {
        const socket = io.connect(ENDPOINT);

        socket.emit('user join the mind map', 'Nicolas',  (data: string) => {
            getStemCellByMindMap(mainStemCellId);
            
        });

        socket.on('broadcast the user join the mindmap', (data: string) => {
            console.log(data);
        });
        socket.on('first cell of the mindmap created', (data: any) => {
            getStemCellByMindMap(mainStemCellId);
            console.log(data);
        })

        socket.on('cell added to a specific position', (data:any) => {
            getStemCellByMindMap(mainStemCellId);
            console.log(data);
        })

        socket.on('cell has updated', (data: any) => {
            getStemCellByMindMap(mainStemCellId);
            console.log(data);
        })
        socket.on('cell deleted by id', (data:any) => {
            getStemCellByMindMap(mainStemCellId);
            console.log(data);
        })
        
    },[]);

    useEffect(() => {
        getCellsByStemCell(stemCell);
    },[stemCell]);
 
/* -------------------------------------------------------------------------------------------------
    ----- Request socket.io and database -----------------------------------------------------------     
---------------------------------------------------------------------------------------------------- */

    const getStemCellByMindMap = async (mindMapRef:string) => {
        try {
            const socket = io.connect(ENDPOINT);
            socket.emit('get stem cell by mind map', mindMapRef, async(data:any) => {
                if (data.stemCell.length === 0) {
                    socket.emit('create default stem cell', mainStemCellId, async (data: any) => {
                        setStemCell([data.cellCreated]);
                        setMainStemCellId(data.cellCreated._id);
                        //console.log(data);
                    }); 
                } else {
                    setStemCell(data.stemCell);
                    getCellsByStemCell(data.stemCell);
                    setMainStemCellId(data.stemCell[0]._id);
                    //console.log(data);
                }
            });
        } catch (error) {
            console.log(error);
        };  
    };

    const getCellsByStemCell = (stemCellRef:StemCell[]) => {
        const socket = io.connect(ENDPOINT);
        socket.emit('get cells by stem cell', stemCellRef, (data:any) => {
            setCells(data.cells);
            //console.log(data);
        });
    };

    const doubleclick = (test:Cell) => {
        setStemCell([test]);
    };

    const resetModel = async () => {

        const socket = io.connect(ENDPOINT);
        socket.emit('RESET', );
        setTimeout(function() {window.location.href = '/'}, 500);
    }

/* ---------------------------------------------------------------------------------------------------
    ----- Element ------------------------------------------------------------------------------------     
------------------------------------------------------------------------------------------------------ */
    const listStemCells = () => {
        return stemCell.map((currentStemCell: StemCell) => {
            return <StemCells
                        key={currentStemCell.position}
                        stemCell={currentStemCell}
                    />
        });
    };

    const listCells = () => {
        return cells.map((currentCell: Cell) => {
             return <Cells
                    key={currentCell.position}
                    cell={currentCell}
                    quantityCells={cells.length}
                    actionDoubleClick={doubleclick} 
                />
        }); 
    };

    const listbuttonAddCell = () => {
        if (cells.length === 0) {
            return <ButtonAddCell
                key={1}
                position={2}
                quantityCells={cells.length+2}
                stemCellReferent={stemCell}
                noCell={true}
                cellReferent={cells[0]}
            />
        } else {
            return cells.map((currentCell: Cell) => {
                return <ButtonAddCell
                        key={currentCell.position}
                        position={currentCell.position}
                        quantityCells={cells.length}
                        stemCellReferent={stemCell}
                        noCell={false}
                        cellReferent= {currentCell}
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
                    {listStemCells()}
                    {listCells()}
                    {listbuttonAddCell()}
                </svg>
            </div>

             <div>
                <button onClick={resetModel}>
                    reset
                </button>
            </div>
        </div>
    );
};

/* 
           

*/