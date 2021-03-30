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
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import {ValidatorForm, TextValidator } from "react-material-ui-form-validator";

class AddClaimDialog extends React.Component{

    constructor() {
        super();
        this.state={
            claimText:'',
            reply:false,
            replyNumber:null,
            link:''
        }
    }

    componentDidMount() {
        console.log('sssaaa', this.props.discussion)
    }

    async handdleClick(){
        console.log('you clicked');
        var formdata= new FormData;
        formdata.append('text', this.state.claimText);
        formdata.append('type', this.props.dialog.type);
        formdata.append('for_discussion', this.props.discussion.id);
        formdata.append('owner', this.props.discussion.owner.id)
        formdata.append('parent',this.props.claims.selectedClaim)
        if(this.state.link !== ''){
            formdata.append('link',this.state.link)
        }
        if(this.state.replyNumber != null) {
            formdata.append('in_reply_to', this.state.replyNumber)
        }
        var a =await axios({
            method: 'post',
            url:`${BaseUrl}/api/claims/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formdata
        });
        console.log('requset:::',a)
        if(a.data.suggested === 1){
            await this.props.addClaimDialog(null, 'ادعای شما به صاحب بحث پیشنهاد داده شد.');
            this.setState({claimText: '', reply: false, replyNumber: null, link: ''});
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
                fullWidth>
                <DialogTitle className='text-right' id="alert-dialog-title">{"اضافه کردن ادعای جدید"}</DialogTitle>
                <ValidatorForm ref="form" onSubmit={()=>this.handdleClick()}>
                    <DialogContent style={{textAlign:"right"}}>
                    <DialogContentText className='text-right' id="alert-dialog-description">
                        متن ادعا
                    </DialogContentText>
                    <TextValidator  id="standard-basic" type="text" name="claimText" 
                    value={this.state.claimText} placeholder="متن" 
                    fullWidth multiline onChange={(e)=> this.setState({claimText: e.target.value})} 
                    validators={["required"]} errorMessages={["این فیلد اجباری است"]}/>
                    <br/>
                    <br/>
                    <label>
                        لینک مربوط(اختیاری)
                    </label>
                    <TextValidator type="url" name="Link" value={this.state.link} dir="ltr"
                    className="mt-3"  id="standard-basic" placeholder="https://www.google.com/" 
                    fullWidth multiline onChange={(e)=> this.setState({link: e.target.value})} 
                     />
                    <br/>
                    <div className="d-flex flex-row align-items-center">
                        <Checkbox
                            checked={this.state.reply}
                            onChange={()=>this.setState({reply:!this.state.reply})}
                            value="primary"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <span >
                        در جواب به ادعای:   
                        </span>
                        <FormControl
                            className='ml-5'
                            disabled={!this.state.reply}
                        >
                            <InputLabel id="demo-simple-select-helper-label"></InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={this.state.replyNumber}
                                onChange={(e) =>{
                                    this.setState({replyNumber: e.target.value});
                                }}
                            >
                                <MenuItem value={null}>
                                    <em>هیچ کدام</em>
                                </MenuItem>
                                {this.props.discussion.claims.map((claim, idx)=>{
                                    return(
                                        <MenuItem value={claim.id}>{claim.text.slice(0,20)}</MenuItem>
                                    )
                                })}
                            </Select>
                            <FormHelperText>لطفا ادعای مورد نظر را از لیست انتخاب کنید</FormHelperText>
                        </FormControl>
                    </div>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.props.addClaimDialog()} color="primary">
                        لغو
                    </Button>
                    <Button type="submit" color="primary" autoFocus>
                        ارسال
                    </Button>
                </DialogActions>
                </ValidatorForm>
                
            </Dialog>
        )
    }
}

const mapStateToProps = ({dialog, claims}) => {
    return {dialog, claims}
};
export default connect(
    mapStateToProps,
    {addClaimDialog}
)(AddClaimDialog);