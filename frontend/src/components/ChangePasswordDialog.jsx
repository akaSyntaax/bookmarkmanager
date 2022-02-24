import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ky from 'ky';
import {extractErrorMessage} from '../utils/ErrorUtil';

export default function ChangePasswordDialog(props) {
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatPassword] = React.useState('');
    const [changePending, setChangePending] = React.useState(false);

    const handleSubmit = () => {
        if (password !== repeatPassword) {
            props.displayError('Passwords do not match');
            return;
        }

        if (password.length === 0) {
            props.displayError('Password may not be empty');
            return;
        }

        setChangePending(true);

        ky.post('/api/users/password', {headers: props.requestHeaders, json: {password}}).then(() => {
            setPassword('');
            setRepeatPassword('');
            props.handleClose();
            props.displaySuccess('The password has been changed');
        }).catch(async error => {
            console.error(error, error.response);
            props.displayError('Error while changing password: ' + await extractErrorMessage(error));
        }).finally(() => {
            setChangePending(false);
        });
    };

    const handleKeyPress = e => {
        if (e.which === 13) {
            handleSubmit();
        }
    };

    return (
        <Dialog open={props.dialogOpen} onClose={() => {if (!changePending) props.handleClose();}}>
            <DialogTitle>Change password</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="New password" type="password" fullWidth variant="standard"
                           onChange={e => setPassword(e.target.value)} value={password}/>
                <TextField margin="dense" label="Repeat the new password" type="password" fullWidth variant="standard"
                           onChange={e => setRepeatPassword(e.target.value)} value={repeatPassword} onKeyPress={handleKeyPress}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={changePending} onClick={props.handleClose}>Cancel</Button>
                <LoadingButton loading={changePending} onClick={handleSubmit}>Change password</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
