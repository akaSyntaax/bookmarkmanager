import {Alert, AppBar, Button, Container, Grid, Link, Snackbar, Toolbar, Typography} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {Component} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import axios from 'axios';
import BookmarkIcon from '@mui/icons-material/Bookmarks';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddBookmarkDialog from './AddBookmarkDialog';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {field: 'id', headerName: 'ID', width: '30'},
                {
                    field: 'title',
                    headerName: 'Title',
                    width: '250',
                    editable: true,
                    renderCell: (params) => {
                        return (
                            <>
                                <img alt="favicon" style={{height: '32px'}} src={'https://www.google.com/s2/favicons?sz=64&domain=' + params.row.url}/>
                                <span style={{marginLeft: '3px'}}>{params.row.title}</span>
                            </>
                        );
                    }
                },
                {
                    field: 'url',
                    headerName: 'URL',
                    width: '250',
                    editable: true,
                    renderCell: (params) => <Link underline="none" target="_blank" href={params.row.url}>{params.row.url}</Link>
                },
            ],
            rows: [],
            selectedRows: [],
            deletePending: false,
            refreshPending: false,
            addPending: false,
            addBookmarkDialogOpen: false,
            errorSnackbarText: "",
            errorSnackbarVisible: false,
            errorSnackbarSeverity: "error"
        };
    }

    reloadDataGrid = () => {
        this.setState({refreshPending: true});

        axios.get('/api/bookmarks').then(({data}) => {
            this.setState({rows: data});
            this.setState({refreshPending: false});
        });
    };

    deleteBookmarks = async () => {
        if (this.state.selectedRows.length > 0) {
            this.setState({deletePending: true});

            try {
                await axios.delete('/api/bookmarks', {data: this.state.selectedRows});
                this.reloadDataGrid();
                this.setState({errorSnackbarText: "The bookmarks have been deleted", errorSnackbarVisible: true, errorSnackbarSeverity: "success"});
            } catch (e) {
                console.error(e);
                this.setState({errorSnackbarText: "An error occurred while deleting the bookmarks", errorSnackbarVisible: true, errorSnackbarSeverity: "error"});
            }

            this.setState({deletePending: false});
        }
    };

    handleCellEditCommit = (params) => {
        let updatedObject;

        this.state.rows.forEach(row => {
            if (row.id === params.id) {
                updatedObject = row;
            }
        });

        updatedObject[params.field] = params.value;

        axios.put('/api/bookmarks/' + updatedObject.id, {
            id: updatedObject.id,
            title: updatedObject.title,
            url: updatedObject.url
        }).then(({data}) => {
            this.setState({rows: data});
            this.reloadDataGrid();
        });
    };

    handleRowSelection = (gridSelectionModel) => {
        this.setState({selectedRows: gridSelectionModel});
    };

    handleBookmarkSaving = async (url, title) => {
        this.setState({addPending: true, addBookmarkDialogOpen: false});

        try {
            await axios.post('/api/bookmarks', {url: url, title: title});
            this.reloadDataGrid();
            this.setState({errorSnackbarText: "The bookmark has been added", errorSnackbarVisible: true, errorSnackbarSeverity: "success"});
            return true;
        } catch (e) {
            console.error(e);
            this.setState({errorSnackbarText: "An error occurred while adding the bookmark", errorSnackbarVisible: true, errorSnackbarSeverity: "error"});
            return false;
        } finally {
            this.setState({addPending: false});
        }
    }

    componentDidMount() {
        this.reloadDataGrid();
    }

    render() {
        return (
            <>
                <AppBar>
                    <Toolbar>
                        <BookmarkIcon size="large" sx={{mr: 2}}/>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Bookmark Manager
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
                <Container style={{marginTop: '90px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <DataGrid
                                rows={this.state.rows}
                                columns={this.state.columns}
                                onCellEditCommit={this.handleCellEditCommit}
                                checkboxSelection
                                autoHeight
                                onSelectionModelChange={this.handleRowSelection}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <LoadingButton loading={this.state.refreshPending} startIcon={<RefreshIcon/>} onClick={this.reloadDataGrid} variant="contained"
                                           style={{float: 'right', marginTop: '5px'}}>Refresh</LoadingButton>
                            <LoadingButton disabled={this.state.selectedRows.length === 0} loading={this.state.deletePending} color="error"
                                           startIcon={<DeleteIcon/>} onClick={this.deleteBookmarks} variant="contained"
                                           style={{float: 'right', marginTop: '5px', marginRight: '5px'}}>Delete</LoadingButton>
                            <LoadingButton loading={this.state.addPending} startIcon={<AddIcon/>} onClick={() => this.setState({addBookmarkDialogOpen: true})}
                                           variant="contained" style={{float: 'right', marginTop: '5px', marginRight: '5px'}}>Add</LoadingButton>
                        </Grid>
                    </Grid>

                    <AddBookmarkDialog dialogOpen={this.state.addBookmarkDialogOpen} handleClose={() => this.setState({addBookmarkDialogOpen: false})} handleSave={this.handleBookmarkSaving}/>

                    <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={this.state.errorSnackbarVisible} autoHideDuration={6000} onClose={() => this.setState({errorSnackbarVisible: false})}>
                        <Alert onClose={() => this.setState({errorSnackbarVisible: false})} severity={this.state.errorSnackbarSeverity} sx={{ width: '100%' }}>
                            {this.state.errorSnackbarText}
                        </Alert>
                    </Snackbar>
                </Container>
            </>
        );
    }
}
