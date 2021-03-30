import React from "react";
import {connect} from "react-redux";
import {addManagerDialog} from "../../actions/diaog";
import axios from "axios";
import {BaseUrl, BaseUrlFront} from "../../BaseUrl";
import {InformationDiscussion} from "../../actions/discussion";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from '@material-ui/icons/Done';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {Redirect} from "react-router-dom";
import {searchError} from "../../actions/messages";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {func} from "prop-types";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Chip from "@material-ui/core/Chip";
import { OutlinedInput } from "@material-ui/core";

class Information extends React.Component{
    constructor() {
        super();
        this.state={
            discussion:null,
            title:'',
            text:'',
            type:'',
            id:'',
            photo:null,
            owner:false,
            successopen:false,
            erroropen:false,
            errormes:'',
            ready:false,
            ownerDialog:false,
            NewOwner:'',
            tags:['only', 'hello', 'bye'],
            tagText:''
        }
    }


    async handleClick(e){
        e.preventDefault();
        let formData = new FormData;
        if (this.state.title != null){ formData.append('title', this.state.title)}
        if (this.state.text != null){ formData.append('text', this.state.text)}
        if (this.state.type != null){ formData.append('type', this.state.type)}
        if(this.state.photo != null){
            formData.append('photo', this.state.photo);
        }
        let a =await axios({
            method: 'put',
            url:`${BaseUrl}/api/discussions/update/information/`+this.props.id+'/',
            headers: {Authorization:'token '+localStorage.getItem('token'),
            },
            data: formData
        });
        if(a.status === 200){
            this.setState({successopen: true})
            this.props.InformationDiscussion(a.data, 'success')
        }else{
            this.setState({erroropen: true, errormes:a})
        }
    }

    async ownerChanger(){
        var self = this;
        let formData = new FormData;
        formData.append('owner', this.state.NewOwner);
        await axios({
            method: 'put',
            url:`${BaseUrl}/api/discussions/update/addMember/${this.props.id}/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formData
        }).then(async function (response) {
            await self.setState({ownerDialog: false})
            self.setState({NewOwner: '-owner!'})
        }).catch(function (error) {
            self.props.searchError(JSON.stringify(error))
        })
    }

    componentDidMount() {
        this.setState({
            title:this.props.title,
            text:this.props.text,
            type:this.props.type,
            owner:this.props.owner,
            tags:this.props.tags
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.title !== this.props.title){
            this.setState({
                title:this.props.title,
                text:this.props.text,
                type:this.props.type,
                owner:this.props.owner,
                tags:this.props.tags
            })
        }
        if(prevProps.title !== this.props.title && this.props.title == ''){
            console.log('yeap')
        }
    }

    fileChange=event=>{
        console.log(this.state)
        this.setState({
            ...this.state,
            photo: event.target.files[0],
        })
    }
    handleChange = event => {
        event.persist();
        this.setState({
            [event.target.name]: event.target.value
        });
    };


    render() {
        if(this.state.NewOwner === '-owner!'){
            return (
                <Redirect to={`/`}/>
            )
        }
        const { title, text, type, link } = this.state;
        return (
            <div className='row'>

                <div className="col-md-5">
                    <div className="card card-body mt-6">
                        <h3 className="">بحث جدید</h3>
                        <br />
                        <ValidatorForm ref="form" onSubmit={e=>this.handleClick(e)} style={{width:'100%'}}>
                            <div className="form-group">
                                <TextValidator
                                    className="mb-16 w-100"
                                    label="عنوان"
                                    onChange={this.handleChange}
                                    type="text"
                                    name="title"
                                    value={title}
                                    validators={["required"]}
                                    errorMessages={["این فیلد اجباریست"]}
                                />
                            </div>
                            <div className="form-group">
                                <TextValidator
                                    variant="outlined"
                                    multiline
                                    rows={8}
                                    className="mb-16 w-100"
                                    label="متن"
                                    onChange={this.handleChange}
                                    type="text"
                                    name="text"
                                    value={text}
                                    validators={["required"]}
                                    errorMessages={["این فیلد اجباریست"]}
                                />
                            </div>
                            <div className="form-group">
                                <TextValidator
                                    className="mb-16 w-100"
                                    label="لینک الحاقی(اختیاری)"
                                    onChange={this.handleChange}
                                    type="text"
                                    name="link"
                                    value={link}
                                />
                            </div>
                            
                            <div className="form-group">
                                <p>
                                    تصویر موجود در بحث: <a href={(this.props.photo != null)?this.props.photo:''}>photo</a>
                                </p>
                                <label>تصویر جدید</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="photo"
                                    onChange={this.fileChange}
                                    //value={}
                                        />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary" onClick={(e) => this.handleClick(e)}>
                                    ذخیره
                                </button>
                                {this.state.owner &&
                                    <button className="btn btn-primary mr-2" onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({ready:!this.state.ready})
                                    }}>
                                        تغییر مالک بحث
                                    </button>
                                }
                            </div>
                            {this.state.ready &&
                                <div style={{transition:'500ms'}}>
                                    <TextField id="standard-basic" label="Search New Owner" onChange={(e)=> this.setState({NewOwner:e.target.value})} />
                                    <IconButton aria-label="delete" onClick={()=>this.setState({ownerDialog: true})}>
                                        <DoneIcon />
                                    </IconButton>
                                </div>
                            }
                        </ValidatorForm>
                    </div>
                </div>
                <div className="col-md-7 col-12">
                    <div className="card card-body mt-2">
                        <div className="d-flex flex-row align-items-center justify-content-around" style={{width:'100%'}}>
                            <div className="d-flex flex-row align-items-center">
                                <h3 className="mb-1">برچسب ها</h3>
                                <LocalOfferIcon/>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <TextField id="standard-basic" className="ml-5" placeholder="برچسب جدید" value={this.state.tagText} onChange={(e)=> this.setState({tagText:e.target.value})} />
                                <IconButton onClick={async ()=>{
                                    if(this.state.tagText != '') {
                                        let self= this;
                                        await axios({
                                            method:'put',
                                            url:`${BaseUrl}/api/discussions/update/addTag/${this.props.id}/`,
                                            headers: {Authorization:'token '+localStorage.getItem('token')},
                                            data:{tag: this.state.tagText}
                                        }).then(function (response) {
                                            let array = self.state.tags;
                                            array.push(self.state.tagText)
                                            self.setState({tagText: '', tags: array})
                                        }).catch(function (error) {

                                        });
                                    }
                                }}>
                                    <AddIcon/>
                                </IconButton>
                            </div>
                        </div>
                        <div className="d-flex mt-5 flex-wrap w-100">
                            {this.state.tags.map((tag, idx)=>{
                                return(
                                        <Chip className="m-2"
                                            label={'#'+ tag}
                                            onClick={()=>
                                                this.props.history.push(`${BaseUrlFront}search?tag=${tag}`)
                                            }
                                            onDelete={async ()=>{
                                                let self = this;
                                                await axios({
                                                    method:'put',
                                                    url:`${BaseUrl}/api/discussions/update/deleteTag/${this.props.id}/`,
                                                    headers: {Authorization:'token '+localStorage.getItem('token')},
                                                    data:{tag:tag}
                                                }).then(function (response) {
                                                    let array= self.state.tags;
                                                    array.splice(idx, 1)
                                                    self.setState({tags: array})
                                                }).catch(function (error) {

                                                })
                                            }}
                                        />
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Dialog
                    open={this.state.ownerDialog}
                    onClose={()=>this.setState({ownerDialog: false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                    <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            آیا از تغییر مالک بحث مطمئنید؟
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>this.setState({ownerDialog: false})} color="primary">
                            نه
                        </Button>
                        <Button onClick={()=>this.ownerChanger()} color="primary" autoFocus>
                            بله
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}


export default connect(
    null ,
    {addManagerDialog, InformationDiscussion, searchError}
)(Information)