import {Component} from 'react';
import {Routes, Route} from 'react-router-dom';
import MainRoute from './routes/MainRoute';
import LoginRoute from './routes/LoginRoute';
import RegisterRoute from './routes/RegisterRoute';
import MenuBar from './components/MenuBar';
import {Container} from '@mui/material';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

export default class App extends Component {
    render() {
        return (
            <>
                <MenuBar/>
                <Container style={{marginTop: '90px'}}>
                    <Routes>
                        <Route path="/" element={<AuthenticatedRoute><MainRoute/></AuthenticatedRoute>}/>
                        <Route path="/login" element={<UnauthenticatedRoute><LoginRoute/></UnauthenticatedRoute>}/>
                        <Route path="/register" element={<UnauthenticatedRoute><RegisterRoute/></UnauthenticatedRoute>}/>
                    </Routes>
                </Container>
            </>
        );
    }
}
