import {Component} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';

export default class AddBookmarkDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: "",
            title: ""
        }
    };

    handleURLInput = (e) => {
        if (e.target.value.length <= 256) {
            this.setState({url: e.target.value})
        }
    };

    handleTitleInput = (e) => {
        if (e.target.value.length <= 64) {
            this.setState({title: e.target.value})
        }
    };

    handleSave = async () => {
        let success = await this.props.handleSave(this.state.url, this.state.title)

        if (success) {
            this.setState({url: "", title: ""})
        }
    };

    render() {
        return (
            <Dialog open={this.props.dialogOpen} onClose={this.props.handleClose}>
                <DialogTitle>Add bookmark</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please fill in the url and optionally a title, then click "Save" to save the bookmark</DialogContentText>
                    <TextField required autoFocus margin="dense" label="URL" type="url" maxLength={5} fullWidth variant="standard" onChange={this.handleURLInput} value={this.state.url}/>
                    <TextField margin="dense" label="Title" type="text" fullWidth variant="standard" onChange={this.handleTitleInput} value={this.state.title}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose}>Cancel</Button>
                    <Button onClick={this.handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
