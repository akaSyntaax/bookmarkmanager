import {Component} from 'react';
import {Grid, Link} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import LoadingButton from '@mui/lab/LoadingButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddBookmarkDialog from '../components/AddBookmarkDialog';
import axios from 'axios';

export default class MainRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {field: 'id', headerName: 'ID', width: '30'},
                {
                    field: 'title',
                    headerName: 'Title',
                    flex: 1,
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
                    flex: 4,
                    editable: true,
                    renderCell: (params) => <Link underline="none" target="_blank" href={params.row.url}>{params.row.url}</Link>
                },
            ],
            rows: [],
            selectedRows: [],
            deletePending: false,
            refreshPending: false,
            addBookmarkDialogOpen: false
        };
    }

    reloadDataGrid = () => {
        this.setState({refreshPending: true});

        axios.get('/api/bookmarks', {
            headers: this.props.axiosHeaders
        }).then(response => {
            this.setState({rows: response.data});
        }).catch(error => {
            console.error(error, error.response);
            this.props.displayError('An error occurred while loading the bookmarks: ' + error.response.data.error);
        }).finally(() => {
            this.setState({refreshPending: false});
        });
    };

    deleteBookmarks = () => {
        if (this.state.selectedRows.length > 0) {
            this.setState({deletePending: true});

            axios.delete('/api/bookmarks', {
                headers: this.props.axiosHeaders,
                data: this.state.selectedRows
            }).then(() => {
                this.reloadDataGrid();
                this.props.displaySuccess('The bookmarks have been deleted');
            }).catch(error => {
                console.error(error, error.response);
                this.props.displayError('An error occurred while deleting the bookmarks: ' + error.response.data.error);
            }).finally(() => {
                this.setState({deletePending: false});
            });
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

        axios.patch('/api/bookmarks/' + updatedObject.id, {
            title: updatedObject.title,
            url: updatedObject.url
        }, {headers: this.props.axiosHeaders}).then(() => {
            this.props.displaySuccess('The bookmark has been updated');
        }).catch(error => {
            console.error(error, error.response);
            this.props.displayError('An error occurred while updating the bookmark: ' + error.response.data.error);
        });
    };

    handleRowSelection = (gridSelectionModel) => {
        this.setState({selectedRows: gridSelectionModel});
    };

    componentDidMount() {
        this.reloadDataGrid();
    }

    render() {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DataGrid rows={this.state.rows} columns={this.state.columns} onCellEditCommit={this.handleCellEditCommit} checkboxSelection autoHeight
                                  onSelectionModelChange={this.handleRowSelection}/>
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

                <AddBookmarkDialog dialogOpen={this.state.addBookmarkDialogOpen} handleClose={(bookmarkAdded = false) => {this.setState({addBookmarkDialogOpen: false}); if (bookmarkAdded) {this.reloadDataGrid();}}}
                                   displaySuccess={this.props.displaySuccess} displayError={this.props.displayError} axiosHeaders={this.props.axiosHeaders}/>
            </>
        );
    }
}
