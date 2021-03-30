import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {addDiscussion} from "../../actions/discussion";
import {addClaim} from "../../actions/claims";
import { returnErrors } from "../../actions/messages";
import '../../libs/style.css'
import '../../libs/orgchart.css'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from "@material-ui/core/CircularProgress";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import {BaseUrlFront} from "../../BaseUrl";
import Checkbox from "@material-ui/core/Checkbox";
import history from "../../historyForRouter/history";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Chip from "@material-ui/core/Chip";


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class NewDiscussion extends Component {
    state = {
        username: "",
        password: "",
        isAdding:false,
    };
    static propTypes = {
        addDiscussion:PropTypes.func.isRequired,
        addClaim:PropTypes.func.isRequired,
        disscussionAdded: PropTypes.bool,
        disscussionAdding:PropTypes.bool,
        addedId:PropTypes.number,
    };

    constructor() {
        super();
        this.state={
            successopen:false,
            erroropen:false,
            loading:false,
            tags:[],
            tagText:'',
            private:false,
            link:'',
            type:1,
            mes:null
        }
    }


    onSubmit =async e => {
        e.preventDefault();
        if(this.state.photo) {
            await this.setState({loading: true})
            var formData = new FormData();
            formData.append('photo', this.state.photo)
            formData.append('title', this.state.title)
            formData.append('text', this.state.text)
            formData.append('type', this.state.type)
            formData.append('private', this.state.private)
            if (this.state.link != undefined || this.state.link != '' || this.state.link != null) {
                formData.append('link', this.state.link)
            }
            if (this.state.tags.length != 0) {
                for (let i in this.state.tags) {
                    formData.append('tags', this.state.tags[i])
                }
                //console.log(formData.get('tags'))
            }
            this.setState({
                ...this.state,
                isAdding: true
            });
            await this.props.addDiscussion(formData);
            await this.setState({loading: false})
            if (this.props.errorshow == null) {
                await this.setState({successopen: true})
                history.push("/discussion/" + this.props.addedId);
                window.location.reload(false)
            } else {
                await this.setState({erroropen: true})

            }
        }else{
            await this.setState({erroropen: true, mes:'عکس برای بحث انتخاب کنید.'})
        }
    };

    handleChange = event => {
        event.persist();
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    fileChange=event=>{
        console.log(this.state)
        this.setState({
            ...this.state,
            photo: event.target.files[0],
        })
    }

    render() {
        const { title, text, type, link } = this.state;
        return (
            <div className='row'>
               
                <div className="col-md-5">
                    <div className="card card-body mt-6">
                        <h3 className="">بحث جدید</h3>
                            <br />
                            <ValidatorForm ref="form" onSubmit={this.onSubmit} style={{width:'100%'}}>
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
                                        multiline={true}
                                        rows={8}
                                        variant="outlined"
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
                                    <div>
                                    <Checkbox
                                        checked={this.state.private}
                                        onChange={()=>this.setState({private: !this.state.private})}
                                        value="primary"
                                        inputProps={{ 'aria-label': 'private discussion' }}
                                    />
                                        بحث خصوصی
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>نوع بحث</label>
                                    <div>
                                        <div>
                                        <FormControlLabel 
                                        value="bottom"
                                        control={<Radio
                                            checked={type === 1}
                                            onChange={()=>this.setState({type: 1})}
                                            value="1"
                                            name="radio-button-demo"
                                            inputProps={{ 'aria-label': 'A' }}
                                        />}
                                        label={<span style={{fontSize: 16}}>تک بحث</span>}
                                        labelPlacement="left"
                                    />
                                        </div>
                                    <div>
                                    <FormControlLabel
                                        value="bottom"
                                        control={<Radio
                                            checked={type === 2}
                                            onChange={()=>this.setState({type: 2})}
                                            value="2"
                                            name="radio-button-demo"
                                            inputProps={{ 'aria-label': 'B' }}/>}
                                            label={<span style={{fontSize: 16}}>چند بحث</span>}
                                            labelPlacement="left"
                                    />
                                    </div>
                                    
                                    </div>
                                   

                                </div>
                                <div className="form-group">
                                    <label>تصویر بحث</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="photo"
                                        onChange={this.fileChange}

                                    />
                                </div>
                                <div className="form-group">
                                    <button type='submit' className="btn btn-primary">
                                        ساختن بحث
                                    </button>
                                    {this.state.loading &&
                                    <CircularProgress style={{marginLeft:10}}/>
                                    }
                                </div>
                                {/*<p style={{ color: "red" }}>{this.props.error}</p>*/}
                            </ValidatorForm>
                        </div>
                    </div>
                    <div className="col-md-6 col-12">
                    <div className="card card-body mt-2">
                        <div className="d-flex flex-row align-items-center justify-content-around" style={{width:'100%'}}>
                            <div className="d-flex flex-row align-items-center">
                                <h3 className="mb-1">برچسب ها</h3>
                                <LocalOfferIcon/>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <TextField id="standard-basic" className="ml-5" placeholder="تگ جدید" value={this.state.tagText} onChange={(e)=> this.setState({tagText:e.target.value})} />
                                <IconButton onClick={()=>{
                                    if(this.state.tagText != '') {
                                        let array = this.state.tags;
                                        array.push( this.state.tagText)
                                        this.setState({tagText: '', tags: array})
                                    }
                                }}>
                                    <AddIcon/>
                                </IconButton>
                            </div>
                        </div>
                        <div className="d-flex mt-5 flex-wrap w-100" >
                            {this.state.tags.map((tag, idx)=>{
                                return(
                                        <Chip className="m-2"
                                            label={'#'+ tag}
                                            onClick={()=>
                                                this.props.history.push(`${BaseUrlFront}search?tag=${tag}`)
                                            }
                                            onDelete={()=>{
                                                let array= this.state.tags;
                                                array.splice(idx, 1)
                                                this.setState({tags: array})
                                            }}
                                        />
                                )
                            })}
                        </div>
                    </div>
                </div>
                    <div className="col-md-3"></div>
                    <div className="col-md-3"></div>
                <Snackbar open={this.state.successopen} autoHideDuration={3000} onClose={() => this.setState({successopen: false})}>
                    <Alert onClose={() => this.setState({successopen: false})} severity="success">
                        بحث با موفقیت ساخته‌شد
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false, mes: null})}>
                    <Alert onClose={() => this.setState({erroropen: false, mes: null})} severity="error">
                        {(this.state.mes)?this.state.mes:this.props.error}
                    </Alert>
                </Snackbar>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    error:JSON.stringify(state.errors.msg),
    errorshow:state.errors.status,
    disscussionAdded: state.discussions.disscussionAdded
    ,discussion:state.discussions.discussions,
    disscussionAdding:state.discussions.disscussionAdding,
    addedId:state.discussions.addedId
});

export default connect(
    mapStateToProps,
    {addDiscussion,returnErrors,addClaim}
)(NewDiscussion);
