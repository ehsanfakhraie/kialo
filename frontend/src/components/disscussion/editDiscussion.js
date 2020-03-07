import React from 'react'
import { connect } from "react-redux";
import { Container, Row } from "reactstrap";
import '../../styles/main-content.scss'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {addManagerDialog} from "../../actions/diaog";
import SearchDialog from '../disscussion/searchUserDialog'
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {BaseUrl} from "../../BaseUrl";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class editDiscussion extends React.Component {

    async openDialog(title) {
        await this.props.addManagerDialog(title)
    }

    constructor() {
        super();
        this.state={
            discussion:null,
            AddNewManager:[],
            AddNewWriter:[],
            AddNewEditor:[],
            title:'',
            text:'',
            type:'',
            id:'',
            photo:null,
            successopen:false,
            erroropen:false,
            errormes:''
        }
    }

    async componentDidMount() {
        const { id } = this.props.match.params
        var a =await axios({
            method: 'get',
            url:`${BaseUrl}/api/discussions/`+ id,
        });
        console.log(a)
        if(a.data != undefined){
            this.setState({
                            discussion: a.data,
                            title:a.data.title,
                            text:a.data.text,
                            type:a.data.type,
                            id:a.data.owner.id
                        })
                        console.log('di',this.state.discussion)
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dialog.discussions.editDiscussion != this.props.dialog.discussions.editDiscussion){
            await this.setState({AddNewManager: this.props.dialog.discussions.editDiscussion["Add new manager"]
                , AddNewWriter: this.props.dialog.discussions.editDiscussion["Add new writer"]
                , AddNewEditor: this.props.dialog.discussions.editDiscussion["Add new editor"]})
            console.log(this.state.AddNewManager, 'rrrrrrrrrrrrr')
        }
        if (prevProps.dialog.errors.searchError !== this.props.dialog.errors.searchError && this.props.dialog.errors.searchError != null){
            this.setState({erroropen: true, errormes: this.props.dialog.errors.searchError})
        }

    }

    async handleClick(e){
        const { id } = this.props.match.params
        e.preventDefault();
        let formData = new FormData;
        formData.append('title', this.state.title);
        formData.append('text', this.state.text);
        formData.append('type', this.state.type);
        formData.append('owner', this.state.id);
        if(this.state.photo != null){

        }
        for (let x in this.state.AddNewManager) {
            formData.append('managers', this.state.AddNewManager[x].id)
            console.log(this.state.AddNewManager[x].id)
        }
        for (let x in this.state.AddNewEditor) {
            formData.append('editors', this.state.AddNewEditor[x].id)
        }
        for (let x in this.state.AddNewWriter) {
            formData.append('writers', this.state.AddNewWriter[x].id)
        }
        console.log(formData.get('managers'))
        var a =await axios({
            method: 'put',
            url:`${BaseUrl}/api/discussions/`+id+'/',
            headers: {Authorization:'token '+localStorage.getItem('token'),
            },
            data: formData
        });
        if(a.status === 200){
            this.setState({successopen: true})
        }else{
            this.setState({erroropen: true, errormes:a})
        }
        console.log(a)
    }

    fileChange=event=>{
        console.log(this.state)
        this.setState({
            ...this.state,
            photo: event.target.files[0],
        })
    }

    render() {
        console.log('dialog::', this.props.dialog.dialog)
        return(
            <div className = 'app-wrapper'>
                <Container>
                    <Row>
                        <div className="col-md-6">
                            <div className="card card-body mt-6">
                                <h3 className="">Edit Discussion</h3>
                                <br />
                                <form>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            onChange={(e)=>this.setState({title: e.target.value})}
                                            value={this.state.title}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Text</label>
                                        <textarea
                                            className="form-control"
                                            name="text"
                                            onChange={(e)=>this.setState({text: e.target.value})}
                                            value={this.state.text}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Type</label>
                                        <select
                                            type=""
                                            className="form-control"
                                            name="type"
                                            onChange={(e)=>this.setState({type: e.target.value})}
                                            value={this.state.type}
                                        >
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>photo</label>
                                        <p>
                                            your last image was: <a href={(this.state.discussion != null)?this.state.discussion.photo:''}>photo</a>
                                        </p>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="photo"
                                            onChange={this.fileChange}
                                            //value={}
                                        />
                                    </div>
                                    <div className="form-group">
                                    <Button variant="contained" size="large"  color="secondary" style= {{marginTop:'15px'}} className="col-md-12 col-12" onClick={() => this.openDialog('Add new manager')}>
                                        <AddIcon />
                                        Add Manager
                                    </Button>
                                        <p>
                                            {JSON.stringify(this.state.AddNewManager)}
                                        </p>
                                    <Button variant="contained" size="large"  color="secondary" style= {{marginTop:'15px'}} className="col-md-12 col-12" onClick={() => this.openDialog('Add new editor')}>
                                        <AddIcon />
                                        Add Editor
                                    </Button>
                                        <p>
                                            {JSON.stringify(this.state.AddNewEditor)}
                                        </p>
                                    <Button variant="contained" size="large"  color="secondary" style= {{marginTop:'15px'}} className="col-md-12 col-12" onClick={() => this.openDialog('Add new writer')}>
                                        <AddIcon />
                                        Add Writer
                                    </Button>
                                        <p>
                                            {JSON.stringify(this.state.AddNewWriter)}
                                        </p>
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary" onClick={(e) => this.handleClick(e)}>
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Row>
                </Container>
                <SearchDialog
                    open = {this.props.dialog.dialog.openDialog}
                    title = {this.props.dialog.dialog.title}
                />
                <Snackbar open={this.state.successopen} autoHideDuration={3000} onClose={() => this.setState({successopen: false})}>
                    <Alert onClose={() => this.setState({successopen: false})} severity="success">
                        discussion updated successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false})}>
                    <Alert onClose={() => this.setState({erroropen: false})} severity="error">
                        {this.state.errormes}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

const mapStateToProps = (dialog) => {
    console.log('sssss',dialog)
    return {dialog}
};

export default connect(
    mapStateToProps,
    {addManagerDialog}
)(editDiscussion)