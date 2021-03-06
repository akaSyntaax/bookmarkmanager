import React from 'react';
import {Avatar, Box, Container, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import ky from 'ky';
import {handleRequestError} from '../utils/ErrorUtil';

export default function LoginRoute(props) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginPending, setLoginPending] = React.useState(false);

    const handleLogin = () => {
        if (username.length === 0 || password.length === 0) {
            return;
        }

        setLoginPending(true);

        ky.post('/api/users/login', {json: {username, password}}).json().then(response => {
            if (response.success === true) {
                localStorage.setItem('bearerToken', response.token);

                // Causes re-rendering and therefore a manual redirect/reload is not needed
                props.displaySuccess('Login successful');
            }
        }).catch(async error => {
            props.displayError('Login failed: ' + await handleRequestError(error));
            setLoginPending(false);
        });
    };

    const handleKeyPress = e => {
        if (e.which === 13) {
            handleLogin();
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Avatar sx={{m: 1, bgcolor: 'blue'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">Log in to your account</Typography>
                <Box>
                    <TextField disabled={loginPending} margin="normal" fullWidth label="Username" autoComplete="username" autoFocus value={username}
                               onChange={e => setUsername(e.target.value)}/>
                    <TextField disabled={loginPending} margin="normal" fullWidth label="Password" type="password" autoComplete="current-password"
                               value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress}/>
                    <LoadingButton loading={loginPending} onClick={handleLogin} fullWidth variant="contained" sx={{mt: 2, mb: 2}}>Login</LoadingButton>
                </Box>
            </Box>
        </Container>
    );
}
