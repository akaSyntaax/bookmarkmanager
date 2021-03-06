import React from 'react';
import {Avatar, Box, Container, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {useNavigate} from 'react-router-dom';
import {handleRequestError} from '../utils/ErrorUtil';
import ky from 'ky';

export default function RegisterRoute(props) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [registrationPending, setRegistrationPending] = React.useState(false);
    const navigate = useNavigate();

    const handleRegistration = () => {
        if (username.length === 0 || password.length === 0) {
            return;
        }

        setRegistrationPending(true);

        ky.post('/api/users/register', {json: {username, password}}).json().then(response => {
            if (response.success === true) {
                props.displaySuccess('Your account has been created. You may now log in');
                navigate('/login');
            }
        }).catch(async error => {
            props.displayError('Registration failed: ' + await handleRequestError(error));
            setRegistrationPending(false);
        });
    };

    const handleKeyPress = e => {
        if (e.which === 13) {
            handleRegistration();
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Avatar sx={{m: 1, bgcolor: 'blue'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">Register an account</Typography>
                <Box>
                    <TextField disabled={registrationPending} margin="normal" fullWidth label="Username" autoComplete="username" autoFocus value={username}
                               onChange={e => setUsername(e.target.value)}/>
                    <TextField disabled={registrationPending} margin="normal" fullWidth label="Password" type="password" autoComplete="current-password"
                               value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress}/>
                    <LoadingButton loading={registrationPending} onClick={handleRegistration} fullWidth variant="contained" sx={{mt: 2, mb: 2}}>
                        Register
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
}
