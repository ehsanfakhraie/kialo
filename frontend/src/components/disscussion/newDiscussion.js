import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Container, Row } from "reactstrap";
import {addDiscussion} from "../../actions/discussion";
import {addClaim} from "../../actions/claims";
import { returnErrors } from "../../actions/messages";
import '../../libs/style.css'
import '../../libs/orgchart.css'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from "@material-ui/core/CircularProgress";

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
        disscussionAdding:PropTypes.bool
    };

    constructor() {
        super();
        this.state={
            successopen:false,
            erroropen:false,
            loading:false
        }
    }


    onSubmit =async e => {
        e.preventDefault();
        await this.setState({loading: true})
        var formData = new FormData();
        formData.append('photo',this.state.photo)
        formData.append('title',this.state.title)
        formData.append('text',this.state.text)
        formData.append('type',this.state.type)

        this.setState({
            ...this.state,
            isAdding:true
        });
        await this.props.addDiscussion(formData);
        await this.setState({loading: false})
        if(this.props.errorshow == null) {
            await this.setState({successopen:true})
            console.log('hi')
        }else{
            await this.setState({erroropen:true})
            console.log('bye')
        }

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
        console.log('errr', this.props.error)
        // if (this.) {
        //     console.log(this.props.disscussionAdded)
        //     return <Redirect to="/" />;
        // }
        // if(this.state.isAdding){
        //     return(
        //         <Container>
        //             Adding Discussion
        //         </Container>
        //     )
        // }
        const { title, text, type } = this.state;
        return (
            <Container>
                <Row>
                    <div className="col-md-6">
                        <div className="card card-body mt-6">
                            <h3 className="">New Discussion</h3>
                            <br />
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        onChange={this.onChange}
                                        value={title}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Text</label>
                                    <textarea
                                        className="form-control"
                                        name="text"
                                        onChange={this.onChange}
                                        value={text}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        type=""
                                        className="form-control"
                                        name="type"
                                        onChange={this.onChange}
                                        value={type}
                                    >
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>photo</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="photo"
                                        onChange={this.fileChange}

                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary">
                                        Add Discussion
                                    </button>
                                    {this.state.loading &&
                                    <CircularProgress style={{marginLeft:10}}/>
                                    }
                                </div>
                                {/*<p style={{ color: "red" }}>{this.props.error}</p>*/}
                            </form>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                    <div className="col-md-3"></div>
                </Row>
                <Snackbar open={this.state.successopen} autoHideDuration={3000} onClose={() => this.setState({successopen: false})}>
                    <Alert onClose={() => this.setState({successopen: false})} severity="success">
                        discussion added successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false})}>
                    <Alert onClose={() => this.setState({erroropen: false})} severity="error">
                        {this.props.error}
                    </Alert>
                </Snackbar>
            </Container>

        );
    }
}

const mapStateToProps = state => ({
    error:JSON.stringify(state.errors.msg),
    errorshow:state.errors.status,
    disscussionAdded: state.discussions.disscussionAdded
    ,discussion:state.discussions.discussions,
    disscussionAdding:state.discussions.disscussionAdding,
});

export default connect(
    mapStateToProps,
    {addDiscussion,returnErrors,addClaim}
)(NewDiscussion);
