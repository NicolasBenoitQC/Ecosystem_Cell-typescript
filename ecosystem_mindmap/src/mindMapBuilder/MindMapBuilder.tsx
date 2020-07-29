import './MindMapBuilder.css';
import React, { useState, useEffect } from 'react';
import { StemCells } from '../stemCells/StemCells';
import { Cells } from '../cells/Cells';
import { ButtonAddCell } from '../cells/ButtonAddCell';
import { ENDPOINT } from '../localhost';
import io from 'socket.io-client';
import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting';

const mindMap: MindMap[] = [{
    _id: 'af46d28s',
    title: 'Mind map DEV',
    description: 'This is the mindmap DEV for build the code',
    active: true,
}]

export const MindMapBuilder: React.FC = () => {

    const [widthSvgViewBox] = useState(WidthSvgViewBox);
    const [heightSvgViewBox] = useState(HeightSvgViewBox);
    const [svgViewBoxProps] = useState(`0 0 ${widthSvgViewBox} ${heightSvgViewBox}`);
    
    const [mainStemCellId] = useState(mindMap[0]._id)
    const [cells, setCells] = useState<Cell[]>([]);
    const [stemCell, setStemCell] = useState<StemCell[]>([]);
    const [refresh, setRefresh] = useState<number>(1);
    const [refreshCells, setRefreshCells] = useState<number>(1);
    
    useEffect( () => {
        getEcosystem('connection');
    },[]);

    useEffect(()=>{
        getEcosystem('refresh');
        
    },[refresh])

    useEffect(()=>{
        getEcosystem('refreshCells');
        
    },[refreshCells])


/* -------------------------------------------------------------------------------------------------
    ----- Request socket.io and database -----------------------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const getEcosystem = (status: string, idRef:string = mainStemCellId) => {
        try {
            const socket = io.connect(ENDPOINT);
            if (status === 'connection') {
                socket.emit('get ecosystem', idRef, true , (data:any) => {
    console.log({
        'Connection : data request get ecosystem.': data,
        'id': idRef,
        'stem cell': stemCell,
        'cells': cells
        });
                    if (data.stemCellOfEcosystem.stemCell_Request.length === 0) {
                        socket.emit('create default stem cell', idRef, (data: any) => { 
                            console.log('mind map empty create default stem cell');
                            console.log({'Create default stem Cell.': data, 'id': idRef});
                            setStemCell([data.cellCreated]);
                        });
                    } else {
                            setStemCell(data.stemCellOfEcosystem.stemCell_Request);
                            setCells(data.cellsOfEcosystem.cells_Request);
                    }; 
                });
            } else if (status === 'refresh') {
                if (stemCell[0]) {
                    socket.emit('get ecosystem', stemCell[0]?._id, false , async (data:any) => {
                        setStemCell(data.stemCellOfEcosystem.stemCell_Request);
                        setCells(data.cellsOfEcosystem.cells_Request);
                        //console.log({'REFRESH : data request get ecosystem.': data});
                    });
                } else {
                    console.log('not refresh')
                }
                
            } else if (status === 'refreshCells') {
                if (stemCell[0]) {
                    socket.emit('get ecosystem', stemCell[0]?._id, false , async (data:any) => {
                        //setStemCell(data.stemCellOfEcosystem.stemCell_Request);
                        setCells(data.cellsOfEcosystem.cells_Request);
                        //console.log({'REFRESH : data request get ecosystem.': data});
                    });
                } else {
                    console.log('not refreshCells')
                }
                
            }; 
        } catch (error) {
            console.log(error)
        };
    };

    const refreshEcosystem: any = async () => {
        setRefresh(refresh+1);
    };

    const refreshCellsEcosystem: any = async () => {
        setRefreshCells(refreshCells+1);
    };



    const doubleClick:any = async (test:StemCell) => {
        const socket = io.connect(ENDPOINT);
        socket.emit('get cell by _id', test._id, (data:any) => {
            setStemCell(data.cell);
            refreshEcosystem();
        })

    };

    const returnPreviousStemCell = () => {
        const socket = io.connect(ENDPOINT);
        socket.emit('get cell by _id', stemCell[0].idStemCell, (data:any) => {
            setStemCell(data.cell);
            refreshEcosystem();
        })
    }

/* ---------------------------------------------------------------------------------------------------
    ----- Element ------------------------------------------------------------------------------------     
------------------------------------------------------------------------------------------------------ */
    const listStemCells = () => {
        if (stemCell[0]) {
            return stemCell.map((currentStemCell: StemCell) => { 
                return <StemCells
                            key={currentStemCell?.position}
                            stemCellProps={currentStemCell}
                            refreshCells={refreshEcosystem}
                        />
            });
        }; 
    };  

    const listCells = () => {
        return cells.map((currentCell: Cell) => {
             return <Cells
                    key={currentCell.position}
                    cell={currentCell}
                    quantityCells={cells.length}
                    actionDoubleClick={doubleClick} 
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
                refreshCells={refreshEcosystem}
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
                        refreshCells={refreshEcosystem}
                    />
            });
        };
    };

    const check = () => {
        console.log({
            'Check!!!!!': '',
            'id': stemCell[0]?._id,
            'stem cell': stemCell,
            'cells': cells
        });
    }

    const resetModel = async () => {

        const socket = io.connect(ENDPOINT);
        socket.emit('RESET', );
        setTimeout(function() {window.location.href = '/'}, 500);
    }

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
                <button onClick={returnPreviousStemCell}>
                    go back
                </button>
                <br/>
                <button onClick={() => {getEcosystem('connection')}}>
                getEcosystem CO
                </button>
                <br/>
                <button onClick={() => {getEcosystem('refreshCells')}}>
                getEcosystem Re
                </button>
                <br/>
                <button onClick={check}>
                CHECK
                </button>
            </div>
        </div>
    );
};