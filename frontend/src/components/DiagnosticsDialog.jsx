import React from 'react';
import {
    Backdrop,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import ky from 'ky';
import {handleRequestError} from '../utils/ErrorUtil';

export default function DiagnosticsDialog(props) {
    const [loadPending, setLoadPending] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        if (props.dialogOpen) {
            setLoadPending(true);

            ky.get('/api/diagnostics', {headers: props.requestHeaders}).json().then((data) => {
                let newRows = [];

                for (const key in data) {
                    newRows.push({id: key, key: key, value: data[key]});
                }

                setRows(newRows);
            }).catch(async error => {
                props.handleClose();
                props.displayError('Error while fetching diagnostics information: ' + await handleRequestError(error));
            }).finally(() => {
                setLoadPending(false);
            });
        }
    }, [props.dialogOpen]);

    return (
        <>
            {!loadPending &&
                <Dialog open={props.dialogOpen} onClose={props.handleClose}>
                    <DialogTitle>Diagnostics</DialogTitle>
                    <DialogContent>
                        <Table size="small" aria-label="diagnostics table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Key</TableCell>
                                    <TableCell align="right">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.key} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell component="th" scope="row">{row.key}</TableCell>
                                        <TableCell align="right">{row.value.toString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            }
            {loadPending &&
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={loadPending}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            }
        </>
    );
}
