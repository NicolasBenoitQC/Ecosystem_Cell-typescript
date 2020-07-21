import './Cells.css'
import React, { useEffect, useState } from 'react';
import { ENDPOINT } from '../localhost'; 
import io from 'socket.io-client';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface CellProps {
    position: number
    quantityCells: QuantityCells;
    stemCellReferent: StemCell[];
    noCell: boolean
    cellReferent: Cell
}

export const ButtonAddCell: React.FC<CellProps> = ({position, quantityCells, stemCellReferent, noCell, cellReferent}) => {
    
    const [open, setOpen] = useState<boolean>(false)
    const [cell] = useState(cellReferent); 
/* -------------------------------------------------------------------------------------------------
----- setting paramter of Cells ( SVG, foreignObject )----------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const rotationFormula = 2*Math.PI/(quantityCells *2);
    const originX = WidthSvgViewBox / 2;
    const originY = HeightSvgViewBox / 2;
    const radiusAxisRotation = originX / 2;
    const radiusAdd = originX / 15;
    const positionIdAddCell = position -1;
    const centerOfAddX = originX + ((radiusAxisRotation) * Math.sin(rotationFormula * positionIdAddCell));
    const centerOfAddY = originY - ((radiusAxisRotation) * Math.cos(rotationFormula * positionIdAddCell));
    
    useEffect(() => {
     
    });

    const handleClickOpen= () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTitle = (event:any) => {
        event.preventDefault();
        cell.title = event.target.value;
    };

    const handleChangeDescription = (event:any) => {
        event.preventDefault();
        cell.description = event.target.value;
    };

    const saveEditing = async (event:any) => {
        event.preventDefault();
        try {
            event.preventDefault();
            const socket = io.connect(ENDPOINT);
            if (noCell === true) {
                socket.emit('create first cell of the stem cell', stemCellReferent, (data:any) => {
                    console.log(data);
                });
            } else {
                socket.emit('add cell', cell, (data:any) => {
                    console.log(data);
                });
            }; 
        } catch (error) {
            console.log(error)
        };
        setOpen(false);
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
                        onClick={handleClickOpen}
                        style={{ fontSize: '100%' }}
                    />
                </foreignObject>    
                <div>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                    fullWidth={true} maxWidth={'md'}
                    >
                        <DialogTitle id="form-dialog-title">Create cell</DialogTitle>
                        <DialogContent>
                            <TextField
                            id='filled-basic'
                            label='Title'
                            onChange={handleChangeTitle}
                            InputLabelProps={{shrink: true}}
                        />
                        <br/>
                        <TextField
                            id='filled-basic'
                            label='Description'                 
                            onChange={handleChangeDescription}        
                            fullWidth
                            multiline
                            margin='normal'
                            rowsMax='23'
                            InputLabelProps={{shrink: true}}
                        />
                        <br />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={saveEditing} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </svg>
    );
};
