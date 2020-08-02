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
    refreshCells: any
    parentTreeProps: string[]
}

export const ButtonAddCell: React.FC<CellProps> = ({
        position, quantityCells, stemCellReferent, 
        noCell, cellReferent, refreshCells, parentTreeProps}) => {
    
    const [open, setOpen] = useState<boolean>(false);
    let titleHandle: string;
    let descriptionHandle: string;
    const myRef = React.createRef();
/* -------------------------------------------------------------------------------------------------
----- setting paramter of Cells ( SVG, foreignObject )----------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const rotationFormula = 2*Math.PI/(quantityCells *2);
    const originX = WidthSvgViewBox / 2;
    const originY = HeightSvgViewBox / 2;
    const radiusAxisRotation = originX / 4;
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
        titleHandle = event.target.value;
    };

    const handleChangeDescription = (event:any) => {
        event.preventDefault();
        descriptionHandle = event.target.value;
    };

    const saveEditing = async (event:any) => {
        event.preventDefault();
        const socket = io.connect(ENDPOINT);
        try {
             if (noCell === true) {
                 const firstCell: Cell = { 
                        title: titleHandle, 
                        description: descriptionHandle, 
                        position: 2,
                        idStemCell: stemCellReferent[0]._id,
                        stemCell: false
                    };
                socket.emit('add cell', firstCell, parentTreeProps, (data:any) => {
                    setOpen(false);
                    refreshCells()
                });
            } else {
                const cell: Cell = { 
                    title: titleHandle, 
                    description: descriptionHandle, 
                    position: cellReferent.position,
                    idStemCell: cellReferent.idStemCell,
                    stemCell: cellReferent.stemCell,
                };
                socket.emit('add cell', cell, parentTreeProps, (data:any) => {
                    setOpen(false);
                    refreshCells()
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
                    x={centerOfAddX-1}
                    y={centerOfAddY- 0.9}
                    width={radiusAdd}
                    height={radiusAdd}
                    fontSize='100%'
                >
                    <AddCircleIcon
                        className='add'
                        onClick={handleClickOpen}
                        style={{  
                                fontSize: '10%', 
                                color: 'white',
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'center',
                              }}
                    />
                    </foreignObject>
                  
                <div>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                    fullWidth={true} maxWidth={'md'} ref={myRef}
                    >
                        <DialogTitle id="form-dialog-title">Create cell</DialogTitle>
                        <DialogContent>
                            <TextField
                            id='filled-basic'
                            label='Title'
                            onChange={handleChangeTitle}
                            InputLabelProps={{shrink: true}}
                            autoFocus={true}
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

