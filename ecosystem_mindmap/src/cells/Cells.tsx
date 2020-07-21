import './Cells.css'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting'

export interface CellProps {
    cell: Cell;
    quantityCells: QuantityCells;
    actionDoubleClick: ActionDoubleClick;
}

export const Cells: React.FC<CellProps> = ({cell, quantityCells, actionDoubleClick}) => {

/* -------------------------------------------------------------------------------------------------
----- setting paramter of Cells ( SVG, foreignObject )----------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const rotationFormula = 2*Math.PI/(quantityCells *2);
    const [originX] = useState(WidthSvgViewBox / 2);
    const originY = HeightSvgViewBox / 2;
    const radiusAxisRotation = originX / 2;
    const radiusCells = originX / 6;
    const positionIdCell = cell.position;

    const centerOfCellX = originX + ((radiusAxisRotation) * Math.sin(rotationFormula * positionIdCell));
    const centerOfCellY = originY - ((radiusAxisRotation) * Math.cos(rotationFormula * positionIdCell));
    
    const widthTitleField = radiusCells * 2;
    const heightTitleField = radiusCells * 2;

    const pathEditingCell = `/edit/id_cell:${cell._id}/id_stemCell:${cell.idStemCell}`;

    useEffect(() => {
    });

    return (
        <svg>
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
            <circle className='cellsLayer'
                key={positionIdCell+2}
                cx={centerOfCellX}
                cy={centerOfCellY}
                r={radiusCells}
                fillOpacity='0.1'
                onDoubleClick={() => actionDoubleClick(cell)}
            />
        </svg>
    )
};