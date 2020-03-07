import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from "react-redux";
import {addClaimDialog} from "../actions/diaog";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import discussions from "../reducers/discussions";
import {BaseUrl} from "../BaseUrl";

class AddClaimDialog extends React.Component{

    constructor() {
        super();
        this.state={
            claimText:''
        }
    }

    async handdleClick(){
        console.log('sssss', this.props.discussion)
        console.log('you clicked');
        var formdata= new FormData;
        formdata.append('text', this.state.claimText);
        formdata.append('type', this.props.dialog.type);
        formdata.append('for_discussion', this.props.discussion.id);
        formdata.append('owner', this.props.discussion.owner.id)
        formdata.append('parent',this.props.claims.selectedClaim)
        var a =await axios({
            method: 'post',
            url:`${BaseUrl}/api/claims/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formdata
        });
        console.log('requset:::',a)
        if(a.data.suggested === 1){
            await this.props.addClaimDialog(null, 'please wait until they see your suggest')
        }else{
            await this.props.addClaimDialog()
            window.location.reload(false)
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.dialog.AddClaimDialog}
                onClose={() => this.props.addClaimDialog()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">{"Add New Claim"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        pleas fill the blanks to make a new claim on this discussion.
                    </DialogContentText>
                    <TextField id="standard-basic" label="Standard" fullWidth multiline onChange={(e)=> this.setState({claimText: e.target.value})}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.addClaimDialog()} color="primary">
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

const mapStateToProps = ({dialog, claims}) => {
    console.log('dialog::', discussions)
    return {dialog, claims}
};
export default connect(
    mapStateToProps,
    {addClaimDialog}
)(AddClaimDialog);