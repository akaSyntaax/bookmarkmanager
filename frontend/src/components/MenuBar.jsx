import React from 'react';
import {AppBar, Avatar, Button, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import {AccountCircle, Bookmarks, Login, Logout, Password} from '@mui/icons-material';
import ChangePasswordDialog from './ChangePasswordDialog';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import DiagnosticsDialog from './DiagnosticsDialog';

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export default function MenuBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = React.useState(false);
    const [diagnosticsDialogOpen, setDiagnosticsDialogOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        localStorage.removeItem('bearerToken');
        props.displaySuccess("You have been logged out");
        navigate('/login');
    };

    let userMenu = <></>;

    if (localStorage.getItem('bearerToken') !== null) {
        let claims = parseJwt(localStorage.getItem('bearerToken'));

        userMenu =
            <>
                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" color="inherit"
                            onClick={handleMenu}>
                    <AccountCircle/>
                </IconButton>
                <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{vertical: 'top', horizontal: 'right'}} keepMounted
                      transformOrigin={{vertical: 'top', horizontal: 'right'}} open={Boolean(anchorEl)} onClose={handleClose}
                      PaperProps={{
                          elevation: 0,
                          sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              '& .MuiAvatar-root': {
                                  width: 32,
                                  height: 32,
                                  ml: -0.5,
                                  mr: 1,
                              },
                              '&:before': {
                                  content: '""',
                                  display: 'block',
                                  position: 'absolute',
                                  top: 0,
                                  right: 19,
                                  width: 10,
                                  height: 10,
                                  bgcolor: 'background.paper',
                                  transform: 'translateY(-50%) rotate(45deg)',
                                  zIndex: 0,
                              },
                          },
                      }}>
                    <MenuItem onDoubleClick={() => {handleClose();setDiagnosticsDialogOpen(true)}}>
                        <Avatar sx={{bgcolor: '#3179d2'}}>{claims.sub.charAt(0)}</Avatar> {claims.sub}
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => {handleClose();setChangePasswordDialogOpen(true);}}>
                        <ListItemIcon>
                            <Password fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Change password</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
                <ChangePasswordDialog dialogOpen={changePasswordDialogOpen} handleClose={() => setChangePasswordDialogOpen(false)}
                                      displayError={props.displayError} displaySuccess={props.displaySuccess} requestHeaders={props.requestHeaders}/>
                <DiagnosticsDialog dialogOpen={diagnosticsDialogOpen} handleClose={() => setDiagnosticsDialogOpen(false)}
                                      displayError={props.displayError} displaySuccess={props.displaySuccess} requestHeaders={props.requestHeaders}/>
            </>;
    } else {
        if (props.route === 'login') {
            userMenu = <Button startIcon={<AccountCircle/>} color="inherit" component={RouterLink} to="/register">Register</Button>;
        } else if (props.route === 'register') {
            userMenu = <Button startIcon={<Login/>} color="inherit"  component={RouterLink} to="/login">Login</Button>;
        }
    }

    return (
        <AppBar>
            <Toolbar>
                <Bookmarks size="large" sx={{mr: 2}}/>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>BookmarkManager</Typography>
                {userMenu}
            </Toolbar>
        </AppBar>
    );
}
