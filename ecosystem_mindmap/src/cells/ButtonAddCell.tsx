// Framwork
import React, { useState } from 'react';
import io from 'socket.io-client';

// Framwork material-ui
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Local file
import './Cells.css'
import { ENDPOINT } from '../localhost'; 
import { WidthSvgViewBox, HeightSvgViewBox } from '../svg-setting'

// Typing of the properties of the button add cell.
export interface CellProps {
    position: number
    quantityCells: QuantityCells;
    stemCellProps: StemCell[];
    noCell: boolean
    cellProps: Cell
    refreshCells: any
    parentTreeProps: string[]
}

// ---------------------------------------------------------------------------------------
// Button add cell component. These elements are the buttons + between the cells. 
// ---------------------------------------------------------------------------------------
export const ButtonAddCell: React.FC<CellProps> = ({
                position, quantityCells, stemCellProps, 
                noCell, cellProps, refreshCells, parentTreeProps,
    }) => {
    
    // setting of the stem cell.
    const rotationFormula = 2*Math.PI/(quantityCells *2);
    const originX = WidthSvgViewBox / 2;
    const originY = HeightSvgViewBox / 2;
    const radiusAxisRotation = originX / 4;
    const radiusAdd = originX / 15;
    const positionIdAddCell = position -1;
    const centerOfAddX = originX + ((radiusAxisRotation) * Math.sin(rotationFormula * positionIdAddCell));
    const centerOfAddY = originY - ((radiusAxisRotation) * Math.cos(rotationFormula * positionIdAddCell));

    // State variable.
    const [createCell, setCreateCell] = useState<object>();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dialogState, setDialogState] = useState<boolean>(false);

    // Function, open dialog when stem cell is double clicked.
    const handleClickOpen= () => {
        setDialogState(true);
    };

    // Function, close dialog when button in the dialog is clicked.
    const handleClose = () => {
        setDialogState(false);
    };

    // Function, update the tilte when event is detected in the textfield 'Title'.
    const handleChangeTitle = (event:any) => {
        event.preventDefault();
        let val: string = event.target.value;
        setTitle(val);
    };

    // Function, update the description when event is detected in the textfield 'Description'.
    const handleChangeDescription = (event:any) => {
        event.preventDefault();
        setDescription(event.target.value);
    };

    // Fuction, set variable createCell when a user leaves an input field (textfield).
    const handleOnBlur = () => {
        if (noCell === true) {
            setCreateCell({ 
                   title: title, 
                   description: description, 
                   position: 2,
                   idStemCell: stemCellProps[0]._id,
                   stemCell: false
               });
       } else {
            setCreateCell({ 
                title: title, 
                description: description, 
                position: cellProps.position,
                idStemCell: cellProps.idStemCell,
                stemCell: cellProps.stemCell,
            });
       };
    };

    // Function, create new cell.
    const createNewCell = async (event:any) => {
        event.preventDefault();
        const socket = io.connect(ENDPOINT);
        socket.emit('add cell', createCell, parentTreeProps, (data:any) => {
            setDialogState(false);
            refreshCells()
        });
    };

/* ---------------------------------------------------------------------------------------------------
------------- Render -----------------------------------------------------------------------------    
------------------------------------------------------------------------------------------------------ */
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
                    <Dialog open={dialogState} onClose={handleClose} aria-labelledby="form-dialog-title"
                    fullWidth={true} maxWidth={'md'} 
                    >
                        <DialogTitle id="form-dialog-title">Create cell</DialogTitle>
                        <DialogContent >
                            <form>
                                <TextField
                                    id='filled-basic'
                                    label='Title'
                                    onChange={handleChangeTitle}
                                    InputLabelProps={{shrink: true}}
                                    onBlur={handleOnBlur}
                                    autoFocus={true}
                                />
                                <br/>
                                <TextField
                                    id='filled-basic'
                                    label='Description'                 
                                    onChange={handleChangeDescription}        
                                    InputLabelProps={{shrink: true}}
                                    onBlur={handleOnBlur}
                                    fullWidth
                                    multiline
                                    margin='normal'
                                    rowsMax='23'
                                />
                                <br />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={createNewCell} color="primary">
                                Create new cell
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </svg>
    );
};

