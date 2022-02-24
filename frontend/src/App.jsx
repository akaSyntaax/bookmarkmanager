import React from 'react';
import {Routes, Route} from 'react-router-dom';
import MainRoute from './routes/MainRoute';
import LoginRoute from './routes/LoginRoute';
import RegisterRoute from './routes/RegisterRoute';
import MenuBar from './components/MenuBar';
import {Alert, Container, Snackbar} from '@mui/material';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import NotFoundRoute from './routes/NotFoundRoute';

export default function App() {
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('error');
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const displayError = (errorMessage) => {
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
        setSnackbarVisible(true);
    };

    const displaySuccess = (successMessage) => {
        setSnackbarMessage(successMessage);
        setSnackbarSeverity('success');
        setSnackbarVisible(true);
    };

    const buildRequestHeaders = () => {
        return {Authorization: 'Bearer ' + localStorage.getItem('bearerToken')};
    };

    return (
        <>
            <Container style={{marginTop: '90px'}}>
                <Routes>
                    <Route path="*" element={
                        <>
                            <MenuBar route="register" displaySuccess={displaySuccess} displayError={displayError}/>
                            <NotFoundRoute/>
                        </>
                    }/>
                    <Route path="/" element={
                        <AuthenticatedRoute>
                            <MenuBar displaySuccess={displaySuccess} displayError={displayError} requestHeaders={buildRequestHeaders()}/>
                            <MainRoute displaySuccess={displaySuccess} displayError={displayError} requestHeaders={buildRequestHeaders()}/>
                        </AuthenticatedRoute>
                    }/>
                    <Route path="/login" element={
                        <UnauthenticatedRoute>
                            <MenuBar route="login" displaySuccess={displaySuccess} displayError={displayError}/>
                            <LoginRoute displaySuccess={displaySuccess} displayError={displayError}/>
                        </UnauthenticatedRoute>
                    }/>
                    <Route path="/register" element={
                        <UnauthenticatedRoute>
                            <MenuBar route="register" displaySuccess={displaySuccess} displayError={displayError}/>
                            <RegisterRoute displaySuccess={displaySuccess} displayError={displayError}/>
                        </UnauthenticatedRoute>
                    }/>
                </Routes>
            </Container>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={snackbarVisible} autoHideDuration={6000}
                      onClose={() => setSnackbarVisible(false)}>
                <Alert onClose={() => setSnackbarVisible(false)} severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
