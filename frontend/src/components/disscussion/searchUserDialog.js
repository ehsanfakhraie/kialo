import React from 'react'
import { connect } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {addManagerDialog} from "../../actions/diaog";
import axios from "axios";
import {editDiscussion, InformationDiscussion} from "../../actions/discussion";
import {searchError} from "../../actions/messages";
import {BaseUrl} from "../../BaseUrl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import queryString from "query-string";
import { Checkbox } from '@material-ui/core';

class searchUserDialog extends React.Component {


    async handdleClick(){
        var self = this
        if(!this.state.addingTeam ) {
            let formData = new FormData;
            formData.append(this.props.name, this.state.SearchText)
            await axios({
                method: 'put',
                url: `${BaseUrl}/api/discussions/update/addMember/${this.props.id}/`,
                headers: {Authorization: 'token ' + localStorage.getItem('token')},
                data: formData
            }).then(function (response) {
                let data = {type: 'member', member: self.props.name, data: self.state.SearchText, add: 1};
                self.props.InformationDiscussion(data, response)
                self.props.addManagerDialog()
            }).catch(function (error) {
                self.props.searchError('')
            })
        }else
        {
            let formData2 = new FormData;
            formData2.append(this.props.name, this.state.replyNumber)
            await axios({
                method: 'put',
                url: `${BaseUrl}/api/discussions/update/addTeam/${this.props.id}/`,
                headers: {Authorization: 'token ' + localStorage.getItem('token')},
                data: formData2
            }).then(function (response) {
                window.location.reload(false)
            }).catch(function (error) {
                self.props.searchError('')
            })
        }
    }

    async componentDidMount() {
        let self = this;
        await axios({
            method: 'get',
            url:`${BaseUrl}/api/teams/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        }).then(async function (result) {
            self.setState({teams: result.data})
        }).catch(function (error) {

        })
    }

    constructor() {
        super();
        this.state={
            SearchText:'',
            SearchTeam:'',
            teams:[],
            replyNumber:null,addingTeam:false,
        }
    }

    render() {
        return(
            <Dialog style={{textAlign:"right"}}
                open={this.props.open}
                onClose={() => this.props.addManagerDialog()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <TextField id="standard-basic" disabled={this.state.addingTeam}  label="جستجوی کاربر" fullWidth multiline onChange={(e)=> this.setState({SearchText: e.target.value})}/>
                    <FormControlLabel
                control={
          <Checkbox
          fullWidth
            checked={this.state.addingTeam}
            name="checkedB"
            color="primary"
            onChange={()=>this.setState({addingTeam:!this.state.addingTeam})}
          />
        }
        label="میخوام تیم کاربری اضافه کنم"
      />
                   
                    <TextField id="standard-basic" label="جستجوی تیم" disabled={!this.state.addingTeam} fullWidth multiline onChange={(e)=> this.setState({replyNumber: e.target.value})}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.addManagerDialog()} color="primary">
                        لغو
                    </Button>
                    <Button onClick={() => this.handdleClick()} color="primary" autoFocus>
                        تایید
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
    {addManagerDialog, editDiscussion, InformationDiscussion, searchError}
)(searchUserDialog)
