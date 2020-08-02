// Framwork
import React, { useState } from 'react';
import io from 'socket.io-client';

// Framwork material-ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Local file
import './StemCell.css';
import { ENDPOINT } from '../localhost';
import { OriginX, OriginY, WidthSvgViewBox } from '../svg-setting';

// Typing of the properties of the stem cell component.
interface StemCellProps {
    stemCellProps: StemCell,
    refreshCells: any,
    returnPreviousStemCellProps: any;
};

// ---------------------------------------------------------------------------------------
// Stem cell component. This element generate the cell in the center of the mind map. 
// ---------------------------------------------------------------------------------------
export const StemCell: React.FC<StemCellProps> = ({
                stemCellProps, refreshCells, returnPreviousStemCellProps,
    }) => {

    // setting of the stem cell.
    const originX = OriginX;
    const originY = OriginY;
    const stemCellRadius = (WidthSvgViewBox/2) / 8;
    const radiusAxisRotation = (WidthSvgViewBox/2) / 4;
    const widthTitleField = stemCellRadius * 2;
    const heightTitleField = stemCellRadius * 2;

    // State variable.
    const [updateStemCell, setUpdateStemCell] = useState(stemCellProps);
    const [title, setTitle] = useState(stemCellProps.title);
    const [description, setDescription] = useState(stemCellProps.description);
    const [open, setOpen] = useState<boolean>(false);

/* -------------------------------------------------------------------------------------------------
    ----- Function ---------------------------------------------------------------------------------     
---------------------------------------------------------------------------------------------------- */
 
    // Function, open dialog when stem cell is double clicked.
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Function, close dialog when button in the dialog is clicked.
    const handleClose = async () => {
        setOpen(false);
    };

    // Function, update the tilte when event is detected in the textfield 'Title'.
    const handleChangeTitle = (event: any) => {
        event.preventDefault();
        let val: string = event.target.value;
        setTitle(val);
    };
    
    // Function, update the description when event is detected in the textfield 'Description'.
    const handleChangeDescription = (event:any) => {
        event.preventDefault();
        setDescription(event.target.value);
    };

    // Fuction, set variable updateStemCell when a user leaves an input field (textfield).
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
    
    // Function, saves the change in title and description.
    const saveEditing = async (event:any) => {
        event.preventDefault();
        const socket = io.connect(ENDPOINT);
        socket.emit('update props cell', updateStemCell, async (data:any) => {
            await refreshCells()
            await handleClose(); 
        });    
    };

    // Function, rempves the stem cell and all children associated with that stem cell.
    const deleteCell = async (event:any) => {
        event.preventDefault();
        const socket = io.connect(ENDPOINT);
        socket.emit('delete cell and all child', stemCellProps , async (data:any) => {
            await handleClose(); 
            await returnPreviousStemCellProps();
        });
        
    }

/* ---------------------------------------------------------------------------------------------------
------------- Render -----------------------------------------------------------------------------    
------------------------------------------------------------------------------------------------------ */
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
                x={originX - stemCellRadius}
                y={originY - stemCellRadius}
                width={widthTitleField}
                height={heightTitleField}
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
                                autoFocus={true}
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