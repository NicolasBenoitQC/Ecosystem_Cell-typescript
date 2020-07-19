import './Cells.css'
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import { ENDPOINT } from '../localhost';
import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting'

export interface CellProps {
    position: number;
    quantityCells: QuantityCells;
    stemCellReferent: StemCell[];
    noCell: boolean
}

export const ButtonAddCell: React.FC<CellProps> = ({position, quantityCells, stemCellReferent, noCell}) => {

/* -------------------------------------------------------------------------------------------------
----- setting paramter of Cells ( SVG, foreignObject )----------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const rotationFormula = 2*Math.PI/(quantityCells *2);
    const [originX] = useState(WidthSvgViewBox / 2);
    const originY = HeightSvgViewBox / 2;
    const radiusAxisRotation = originX / 2;
    const radiusAdd = originX / 15;

    const positionIdAddCell = position -1;

    const centerOfAddX = originX + ((radiusAxisRotation) * Math.sin(rotationFormula * positionIdAddCell));
    const centerOfAddY = originY - ((radiusAxisRotation) * Math.cos(rotationFormula * positionIdAddCell));

    useEffect(() => {
    });

    const addNewCell = (event:any) => {
        try {
            event.preventDefault();
            const socket = io.connect(ENDPOINT);
            if (noCell === true) {
                socket.emit('create first cell of the stem cell', stemCellReferent, (data:any) => {
                    console.log(data);
                    console.log(data.cellCreated._id)
                    setTimeout(function() { window.location.href = `/edit/id_cell:${data.cellCreated._id}/id_stemCell:${data.cellCreated.idStemCell}`})
                });
            } else {
                socket.emit('add cell in this position', position ,stemCellReferent, (data:any) => {
                    console.log(data);
                    
                    console.log(data.cellCreated)
                    setTimeout(function() { window.location.href = `/edit/id_cell:${data.cellCreated._id}/id_stemCell:${data.cellCreated.idStemCell}`})
                });
            };
        } catch (error) {
            console.log(error)
        };
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
        </svg>
    )
}