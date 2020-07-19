import './StemCells.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OriginX, OriginY, WidthSvgViewBox } from '../svg-setting';

interface StemCellsProps {
    stemCell: StemCell
};

export const StemCells: React.FC<StemCellsProps> = ({stemCell}) => {

/* -------------------------------------------------------------------------------------------------
----- setting paramter of Stem Cells ( SVG, foreignObject )----------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const originX = OriginX;
    const originY = OriginY;
    const stemCellRadius = (WidthSvgViewBox/2) / 4;
    const radiusAxisRotation = (WidthSvgViewBox/2) / 2;
    const pathEditingCell = `/edit/${stemCell._id}`;

    useEffect(() => {

    });

    return (
        <svg>
            <circle className='stem-cell'
                cx={originX}
                cy={originY}
                r={stemCellRadius}
                stroke='white'
                strokeWidth='0.3'
                fill='gray'
            />
            <foreignObject
                x={originX - 12.5}
                y={originY - 9}
                width='25'
                height='18'
                fontSize='25%' 
                >
                <div className='container-stem-cell-title' >
                    <Link
                        to={pathEditingCell}
                        className='stem-cell-title'>
                        {stemCell.title}
                    </Link>
                </div>
            </foreignObject>
            <circle className='axis-of-rotation-of-cells'
                cx={originX}
                cy={originY}
                r={radiusAxisRotation}
                fill='none'
                stroke='white'
                strokeWidth='0.1'
            />
        </svg>
    )
}