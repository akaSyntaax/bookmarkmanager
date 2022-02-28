import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import ky from 'ky';
import {handleRequestError} from '../utils/ErrorUtil';

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

        ky.post('/api/bookmarks', {headers: props.requestHeaders, json: {url, title}}).then(() => {
            setURL('');
            setTitle('');
            props.handleClose(true);
            props.displaySuccess('The bookmark has been added');
        }).catch(async error => {
            props.displayError('An error occurred while adding the bookmark: ' + await handleRequestError(error));
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
        <Dialog open={props.dialogOpen} onClose={() => {if (!addPending) props.handleClose()}}>
            <DialogTitle>Add bookmark</DialogTitle>
            <DialogContent>
                <DialogContentText>Please fill in the url and optionally a title, then click "Save" to save the bookmark</DialogContentText>
                <TextField autoFocus margin="dense" label="URL" type="url" fullWidth variant="standard" onChange={e => setURL(e.target.value)} value={url}/>
                <TextField margin="dense" label="Title" type="text" fullWidth variant="standard" onChange={e => setTitle(e.target.value)} value={title}
                           onKeyPress={handleKeyPress}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={addPending} onClick={props.handleClose}>Cancel</Button>
                <LoadingButton loading={addPending} onClick={handleSubmit}>Save</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
