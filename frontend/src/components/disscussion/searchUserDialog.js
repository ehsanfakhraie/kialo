import React from 'react'
import { connect } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {addManagerDialog} from "../../actions/diaog";
import axios from "axios";
import {editDiscussion} from "../../actions/discussion";
import {returnErrors, searchError} from "../../actions/messages";
import {BaseUrl} from "../../BaseUrl";

class searchUserDialog extends React.Component {

    async handdleClick(){
        var a =await axios({
            method: 'get',
            url:`${BaseUrl}/api/users/?username=${this.state.SearchText}`,
        });
        if(a.data[0] != undefined){
            console.log('hello', a.data[0])
            this.props.editDiscussion(a.data[0], this.props.title);
            this.props.addManagerDialog()
        }else{
            this.props.searchError('user not found')
        }
    }

    constructor() {
        super();
        this.state={
            SearchText:''
        }
    }

    render() {
        console.log('OPEN:::::')
        return(
            <Dialog
                open={this.props.open}
                onClose={() => this.props.addManagerDialog()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        please find your user 
                    </DialogContentText>
                    <TextField id="standard-basic" label="search..." fullWidth multiline onChange={(e)=> this.setState({SearchText: e.target.value})}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.addManagerDialog()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.handdleClick()} color="primary" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = (dialog) => {
    return {dialog}
};

export default connect(
    mapStateToProps,
    {addManagerDialog, editDiscussion, searchError}
)(searchUserDialog)