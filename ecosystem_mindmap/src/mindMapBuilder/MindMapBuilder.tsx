import './MindMapBuilder.css';
import React, { useState, useEffect } from 'react';
import { StemCells } from '../stemCells/StemCells';
import { Cells } from '../cells/Cells';
import { ENDPOINT } from '../localhost';
import io from 'socket.io-client';


export const MindMapBuilder: React.FC = () => {
    const [cells, setCells] = useState([]);
    const [stemCell, setStemCell] = useState([]);
    const [widtSvgViewBox] = useState(100);
    const [heightSvgViewBox] = useState(70);
    const [svgViewBoxProps] = useState(`0 0 ${widtSvgViewBox} ${heightSvgViewBox}`);

    useEffect( () => {
    // message welcome and alert new entry in the mindmap
        const socket = io.connect(ENDPOINT);
        socket.emit('user join the mind map', 'Nicolas', (data: string) => {
            console.log(data);
            getAllCells();
        })
        socket.on('broadcast the user join the mindmap', (data: string) => {
            console.log(data);
        });
        socket.on('cell has updated', (data: string) => {
            console.log(data);
            getAllCells();
        })
        socket.on('cell deleted by id', (data:string) => {
            console.log(data);
            getAllCells();
        })
        socket.on('cell added to a specific position', (data:string) => {
            getAllCells();
        })
    },[]);
 
/* -------------------------------------------------------------------------------------------------
    ----- Request socket.io and database -----------------------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const getAllCells  = async () => {
        const socket = io.connect(ENDPOINT);
        socket.emit('get all cells', (data: any) => {
           setCells(data);
           console.log(data);
        });
        socket.emit('get stem cell', (data: any) => {
            setStemCell(data);
            console.log(data)
        });
    };

/* ---------------------------------------------------------------------------------------------------
    ------------- Fonction element DOM ---------------------------------------------------------------     
------------------------------------------------------------------------------------------------------ */
    
    const listCells = () => {
        return cells.map((currentCell: Cell) => {
             return <Cells
                    key={currentCell.positionId}
                    cell={currentCell}
                    quantityCells={cells.length}
                    widthViewBox={widtSvgViewBox}
                    heightViewBox={heightSvgViewBox}  
                />
        }); 
    };

    const listStemCells = () => {
        return stemCell.map((currentStemCell: StemCell) => {
            return <StemCells
                        key={currentStemCell.positionId}
                        stemCell={currentStemCell}
                        widthViewBox={widtSvgViewBox}
                        heightViewBox={heightSvgViewBox}
                    />
        });
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
                </svg>
                
            </div> 
        </div>
    )
}