import React, { useState, useEffect } from 'react';
import { ENDPOINT } from '../localhost'; 
import io from 'socket.io-client';

import { makeStyles, Container, 
        TextField, Box, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    rootContainer: {
        margin: '20% 10%',
    },
    rootBox: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: 1,
        padding: 1,
        backgroundColor: 'none',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    rootButton: {
        fontSize: '10px',
        fontFamily: "'Times New Roman', Times, serif",
    }
}));

export const EditingCells: React.FC = () => {
    const [cell, setCell] = useState<Cell | any>({}); // JMA why any

    const url = window.location.pathname;
    const _id = url.substring(url.lastIndexOf('/') + 1);
    
    useEffect(() => {
        getCell(_id);
    },[_id]);

    const getCell = (idCell: any) => {
        const socket = io.connect(ENDPOINT);
        socket.emit('get cell by _id', idCell ,(data:any) => {
            setCell(data[0]);
        })
    };

    const handleChangeTitle = (event:any) => {
        event.preventDefault();
        setCell({
            title: event.target.value,
            description: cell.description,
            positionId: cell.positionId,
        });
    };

    const handleChangeDescription = (event:any) => {
        event.preventDefault();
        setCell({
            title: cell.title,
            description: event.target.value
        });
    };

    const saveEditing = (event:any) => {
        event.preventDefault();
        const updateCircle = cell 

        const socket = io.connect(ENDPOINT);
        socket.emit('update props cell', _id, updateCircle, (data:any) => {
            console.log(data);
        });

        setTimeout(function() {window.location.href = '/'}, 500); // JMA why i need timer
    }

    const cancelEditingCell = (event:any) => {
        event.preventDefault();
        window.location.href = '/';
    }

    const deleteCell = (event:any) => {
        event.preventDefault();
        const socket = io.connect(ENDPOINT);
        socket.emit('delete cell by id', _id, (data:any) => {
            console.log(data);
        })
        setTimeout(function() {window.location.href = '/'}, 500);
    }

    const classes = useStyles();
    return (
        <div>
            <Container maxWidth='sm' className={classes.rootContainer} >
                <form >
                    <TextField
                        id='filled-basic'
                        label='Title'
                        value={cell.title || ''}
                        onChange={handleChangeTitle}
                        InputLabelProps={{shrink: true}}
                    />
                    <br/>
                    <TextField
                        id='filled-basic'
                        label='Description'
                        value={cell.description || ''}
                        onChange={handleChangeDescription}
                        fullWidth
                        multiline
                        margin='normal'
                        rowsMax='23'
                        InputLabelProps={{shrink: true}}
                    />
                    <br />
                    <Box className={classes.rootBox}>
                        <Button
                            className={classes.rootButton}
                            onClick={deleteCell}
                            variant='contained'
                            color='inherit'
                            aria-label='outlined primary button group'
                            disableElevation
                        >
                            delete the Cell
                        </Button>
                        <Button
                            className={classes.rootButton}
                            onClick={saveEditing}
                            variant='contained'
                            color='inherit'
                            aria-label='outlined primary button group'
                            disableElevation
                        >
                            Save editing
                        </Button>
                        <Button
                            className={classes.rootButton}
                            onClick={cancelEditingCell}
                            variant='contained'
                            color='inherit'
                            aria-label='outlined primary button group'
                            disableElevation
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Container>
        </div>
    )    
} 