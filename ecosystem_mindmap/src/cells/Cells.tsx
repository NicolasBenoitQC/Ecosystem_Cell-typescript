import './Cells.css'
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import { ENDPOINT } from '../localhost';



export interface CellProps {
    cell: Cell;
    quantityCells: QuantityCells;
    widthViewBox: WidthViewBox;
    heightViewBox: HeightViewBox;
}

export const Cells: React.FC<CellProps> = ({cell, quantityCells, widthViewBox, heightViewBox}) => {

/* -------------------------------------------------------------------------------------------------
----- setting paramter of Cells ( SVG, foreignObject )----------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const rotationFormula = 2*Math.PI/(quantityCells *2);
    const originX = widthViewBox / 2;
    const originY = heightViewBox / 2;
    const radiusAxisRotation = originX / 2;
    const radiusCells = originX / 6;
    const radiusAdd = originX / 15;
    const positionIdCell = cell.positionId;
    const positionIdAddCell = cell.positionId - 1;

    const centerOfCellX = originX + ((radiusAxisRotation) * Math.sin(rotationFormula * positionIdCell));
    const centerOfCellY = originY - ((radiusAxisRotation) * Math.cos(rotationFormula * positionIdCell));
    const centerOfAddX = originX + ((radiusAxisRotation) * Math.sin(rotationFormula * positionIdAddCell));
    const centerOfAddY = originY - ((radiusAxisRotation) * Math.cos(rotationFormula * positionIdAddCell));
    
    
    const widthTitleField = radiusCells * 2;
    const heightTitleField = radiusCells * 2;
    
    const pathEditingCell = `/edit/${cell._id}`;
    const positionIdOfNewCell = cell.positionId

    useEffect(() => {
    });

    const addNewCell = (event:any) => {
        event.preventDefault();
         const socket = io.connect(ENDPOINT);
        socket.emit('add cell in this position', positionIdOfNewCell, (data:any) => {
            console.log(data);
        });
    };

    return (
        <svg>
            <foreignObject
                className='container-add'
                x={centerOfAddX-radiusAdd/2}
                y={centerOfAddY-radiusAdd/2}
                width={radiusAdd}
                height={radiusAdd}
                fontSize='20%'
            >
                <AddCircleIcon
                    className='add'
                    onClick={addNewCell}
                    style={{ fontSize: '100%' }}
                />
            </foreignObject>
            <circle className='cells'
                key={positionIdCell}
                cx={centerOfCellX}
                cy={centerOfCellY}
                r={radiusCells}
                stroke='white'
                strokeWidth='0.5'
                fill='gray'
            />

            <foreignObject
                x={centerOfCellX-radiusCells}
                y={centerOfCellY-radiusCells}
                width={widthTitleField}
                height={heightTitleField}
                fontSize='20%'
                >
                <div className='container-cell-title' >
                    <Link
                        to={pathEditingCell}
                        className='cell-title'>
                        {cell.title}
                    </Link>
                </div>
            </foreignObject>
        </svg>
    )
}


