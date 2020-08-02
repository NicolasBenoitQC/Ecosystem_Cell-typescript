// Framwork
import React from 'react';

// Local file
import './Cells.css'
import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting'

// Typing of the properties of the cells component.
export interface CellProps {
    cellProps: Cell;
    quantityCells: QuantityCells;
    actionDoubleClick: ActionDoubleClick;
}

// ---------------------------------------------------------------------------------------
// Cells component. This element generate the cells around the center cell of the mind map. 
// ---------------------------------------------------------------------------------------
export const Cells: React.FC<CellProps> = ({cellProps, quantityCells, actionDoubleClick}) => {

    // setting of the template svg.
    const rotationFormula = 2*Math.PI/(quantityCells *2);
    const originX = WidthSvgViewBox / 2;
    const originY = HeightSvgViewBox / 2;
    const radiusAxisRotation = originX / 4;
    const radiusCells = originX / 12;
    const positionIdCell = cellProps.position;

    const centerOfCellX = originX + ((radiusAxisRotation) * Math.sin(rotationFormula * positionIdCell));
    const centerOfCellY = originY - ((radiusAxisRotation) * Math.cos(rotationFormula * positionIdCell));
    
    const widthTitleField = radiusCells * 2;
    const heightTitleField = radiusCells * 2;

/* ---------------------------------------------------------------------------------------------------
------------- Render -----------------------------------------------------------------------------    
------------------------------------------------------------------------------------------------------ */
    return (
        <svg>
            <circle className='cells'
                key={positionIdCell}
                cx={centerOfCellX}
                cy={centerOfCellY}
                r={radiusCells}
                stroke='white'
                strokeWidth='0.1'
                fill='gray'
            />
            <foreignObject
                x={centerOfCellX-radiusCells}
                y={centerOfCellY-radiusCells}
                width={widthTitleField}
                height={heightTitleField}
                fontSize='10%'
                >
                <div className='container-cell-title' >
                    <div className='cell-title'>
                        {cellProps.title}
                    </div>
                </div>
            </foreignObject>
            <circle className='cellsLayer'
                key={positionIdCell+2}
                cx={centerOfCellX}
                cy={centerOfCellY}
                r={radiusCells}
                fillOpacity='0'
                onDoubleClick={() => actionDoubleClick(cellProps)}
            />
        </svg>
    )
};