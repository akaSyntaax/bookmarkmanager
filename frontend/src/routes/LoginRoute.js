import {Component} from 'react';
import {Alert, Avatar, Box, Container, Snackbar, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

export default class LoginRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loginPending: false,
            errorSnackbarText: '',
            errorSnackbarVisible: false,
            errorSnackbarSeverity: 'error',
            loginSucceeded: false
        };
    }

    handleLogin = () => {
        if (this.state.username.length === 0 || this.state.password.length === 0) {
            return;
        }

        this.setState({loginPending: true});

        axios.post('/api/users/login', {
            username: this.state.username,
            password: this.state.password
        }).then(response => {
            if (response.data.success === true) {
                localStorage.setItem('bearerToken', response.data.token);

                this.setState({
                    errorSnackbarText: 'Login successful, redirecting...',
                    errorSnackbarVisible: true,
                    errorSnackbarSeverity: 'success'
                });

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }).catch(error => {
            console.log(error, error.response);
            this.setState({
                errorSnackbarText: 'Login failed: ' + error.response.data.error,
                errorSnackbarVisible: true,
                errorSnackbarSeverity: 'error',
                loginPending: false
            });
        });
    };

    handleKeyPress = e => {
        if (e.which === 13) {
            this.handleLogin();
        }
    };

    render() {
        return (
            <Container maxWidth="xs">
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar sx={{m: 1, bgcolor: 'blue'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">Log in to your account</Typography>
                    <Box>
                        <TextField disabled={this.state.loginPending} margin="normal" fullWidth label="Username" autoComplete="username" autoFocus
                                   value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
                        <TextField disabled={this.state.loginPending} margin="normal" fullWidth label="Password" type="password"
                                   autoComplete="current-password" value={this.state.password} onChange={e => this.setState({password: e.target.value})}
                                   onKeyPress={this.handleKeyPress}/>
                        <LoadingButton loading={this.state.loginPending} onClick={this.handleLogin} fullWidth variant="contained"
                                       sx={{mt: 2, mb: 2}}>Login</LoadingButton>
                    </Box>
                </Box>
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={this.state.errorSnackbarVisible} autoHideDuration={6000}
                          onClose={() => this.setState({errorSnackbarVisible: false})}>
                    <Alert onClose={() => this.setState({errorSnackbarVisible: false})} severity={this.state.errorSnackbarSeverity} sx={{width: '100%'}}>
                        {this.state.errorSnackbarText}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}
