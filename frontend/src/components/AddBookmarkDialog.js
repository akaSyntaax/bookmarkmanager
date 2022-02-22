import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import React from 'react';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';

export default function AddBookmarkDialog(props) {
    const [url, setURL] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [addPending, setAddPending] = React.useState(false);

    const handleSubmit = () => {
        if (url.length === 0) {
            props.displayError('The bookmark url may not be empty');
            return;
        }

        setAddPending(true);

        axios.post('/api/bookmarks', {url, title}, {headers: props.axiosHeaders}).then(() => {
            setURL('');
            setTitle('');
            props.handleClose(true);
            props.displaySuccess('The bookmark has been added');
        }).catch(error => {
            console.error(error, error.response);
            props.displayError('An error occurred while adding the bookmark: ' + error.response.data.error);
        }).finally(() => {
            setAddPending(false);
        });
    };

    const handleKeyPress = e => {
        if (e.which === 13) {
            handleSubmit();
        }
    };

    return (
        <Dialog open={props.dialogOpen} onClose={props.handleClose}>
            <DialogTitle>Add bookmark</DialogTitle>
            <DialogContent>
                <DialogContentText>Please fill in the url and optionally a title, then click "Save" to save the bookmark</DialogContentText>
                <TextField autoFocus margin="dense" label="URL" type="url" fullWidth variant="standard" onChange={e => setURL(e.target.value)} value={url}/>
                <TextField margin="dense" label="Title" type="text" fullWidth variant="standard" onChange={e => setTitle(e.target.value)} value={title}
                           onKeyPress={handleKeyPress}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <LoadingButton loading={addPending} onClick={handleSubmit}>Save</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
