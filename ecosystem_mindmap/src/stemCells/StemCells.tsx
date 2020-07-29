import './StemCells.css';
import React, { useEffect, useState } from 'react';
import { OriginX, OriginY, WidthSvgViewBox } from '../svg-setting';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ENDPOINT } from '../localhost';
import io from 'socket.io-client';

interface StemCellsProps {
    stemCellProps: StemCell,
    refreshCells: any
};

export const StemCells: React.FC<StemCellsProps> = ({stemCellProps, refreshCells}) => {
    //const [stemCell, setStemCell] = useState(stemCellProps);
    const [updateStemCell, setUpdateStemCell] = useState(stemCellProps);
    const [title, setTitle] = useState(stemCellProps.title);
    const [description, setDescription] = useState(stemCellProps.description);
    const [open, setOpen] = useState<boolean>(false);

/* -------------------------------------------------------------------------------------------------
----- setting paramter of Stem Cells ( SVG, foreignObject )----------------------------------------------     
---------------------------------------------------------------------------------------------------- */
    const originX = OriginX;
    const originY = OriginY;
    const stemCellRadius = (WidthSvgViewBox/2) / 8;
    const radiusAxisRotation = (WidthSvgViewBox/2) / 4;

    /* 
    const stemCellRadius = (WidthSvgViewBox/2) / 4;
    const radiusAxisRotation = (WidthSvgViewBox/2) / 2;
    */
//____________________________________________________________________________________________________

     useEffect(() => {
        console.log('useEffect stem cell')
    },[]); 

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTitle = (event: any) => {
        event.preventDefault();
        let val: string = event.target.value;
        setTitle(val);
    };
    
    const handleChangeDescription = (event:any) => {
        event.preventDefault();
        setDescription(event.target.value);
    };

    const handleOnBlur = () => {
        setUpdateStemCell({
            _id: stemCellProps._id,
            title: title,
            description: description,
            position: stemCellProps.position,
            idStemCell: stemCellProps.idStemCell,
            stemCell: stemCellProps.stemCell
        });
    };
    
    const saveEditing = async (event:any) => {
        event.preventDefault();
        setUpdateStemCell({
            _id: stemCellProps._id,
            title: title,
            description: description,
            position: stemCellProps.position,
            idStemCell: stemCellProps.idStemCell,
            stemCell: stemCellProps.stemCell
        });
        const socket = io.connect(ENDPOINT);
        socket.emit('update props cell', updateStemCell, async (data:any) => {
            console.log(data); 
        });
        refreshCells()
        handleClose();    
    };

    const deleteCell = async (event:any) => {
        event.preventDefault();
        const socket = io.connect(ENDPOINT);
        socket.emit('delete cell and all child', stemCellProps._id, stemCellProps.idStemCell, async (data:any) => {
            console.log(data); 
        });
        
    }

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
                fontSize='15%' 
                >
                <div className='container-stem-cell-title' >
                    <div className='stem-cell-title'>
                        {stemCellProps.title}
                    </div>
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
            <circle className='stem-cell'
                cx={originX}
                cy={originY}
                r={stemCellRadius}
                fillOpacity='0'
                onDoubleClick={handleClickOpen}
            />
            <div>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                fullWidth={true} maxWidth={'md'}
                >
                    <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                id='filled-basic'
                                label='Title'
                                defaultValue={stemCellProps.title}
                                onChange={handleChangeTitle}
                                InputLabelProps={{shrink: true}}
                                onBlur={handleOnBlur}
                            />
                            <br/>
                            <TextField
                                id='filled-basic'
                                label='Description' 
                                defaultValue={stemCellProps.description}                
                                onChange={handleChangeDescription}        
                                fullWidth
                                multiline
                                margin='normal'
                                rowsMax='23'
                                InputLabelProps={{shrink: true}}
                                onBlur={handleOnBlur}
                            />
                            <br />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={deleteCell} color="primary">
                            Delete
                        </Button>
                        <Button onClick={saveEditing} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </svg>
    )
};