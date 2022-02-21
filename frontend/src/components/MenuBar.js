import {Component} from 'react';
import {AppBar, Button, Toolbar, Typography} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmarks';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Logout';
import AccountCirlceIcon from '@mui/icons-material/AccountCircle';

export default class MenuBar extends Component {
    handleLogout = () => {
        localStorage.removeItem("bearerToken");
        window.location.reload();
    };

    render() {
        let button = <></>;

        if (localStorage.getItem("bearerToken") !== null) {
            button = <Button startIcon={<LogoutIcon/>} color="inherit" onClick={this.handleLogout}>Logout</Button>;
        } else {
            if (this.props.route === 'login') {
                button = <Button startIcon={<AccountCirlceIcon/>} color="inherit" onClick={() => window.location.href = '/register'}>Register</Button>;
            } else if (this.props.route === 'register') {
                button = <Button startIcon={<LoginIcon/>} color="inherit" onClick={() => window.location.href = '/login'}>Login</Button>;
            }
        }

        return (
            <AppBar>
                <Toolbar>
                    <BookmarkIcon size="large" sx={{mr: 2}}/>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>BookmarkManager</Typography>
                    {button}
                </Toolbar>
            </AppBar>
        );
    }
}
