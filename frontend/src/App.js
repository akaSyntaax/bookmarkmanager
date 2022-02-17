import {AppBar, Button, Container, Grid, Link, Toolbar, Typography} from '@mui/material';
import {Component} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import axios from 'axios';
import BookmarkIcon from '@mui/icons-material/Bookmarks';

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
            rows: []
        };
    }

    reloadDataGrid = () => {
        axios.get('/api/bookmarks').then(({data}) => {
            this.setState({rows: data});
        });
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
                <Container style={{marginTop: "90px"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <DataGrid
                                rows={this.state.rows}
                                columns={this.state.columns}
                                onCellEditCommit={this.handleCellEditCommit}
                                checkboxSelection
                                autoHeight
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button onClick={this.reloadDataGrid} variant="contained" style={{float: 'right', marginTop: '5px'}}>Reload</Button>
                        </Grid>
                    </Grid>
                </Container>
            </>
        );
    }
}
