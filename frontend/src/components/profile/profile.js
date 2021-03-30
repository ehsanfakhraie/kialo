import React, { Component } from 'react';
import {getUserDiscussions, selectDiscussion} from "../../actions/discussion"
import {getUserClaims} from "../../actions/claims"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink, useHistory, Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import PropTypes, {func} from "prop-types";
import { Container, Row, Col, Card, CardBody, CardText, CardSubtitle, CardImg, CardTitle, Form } from "reactstrap";
import './profile.css'
import '../../styles/main-content.scss'
import ContainerText from '../layout/containertext' 
import {suggestedListrDialog} from "../../actions/diaog";
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import Discussions from './Discussions'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import UserTeams from "./UserTeams";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import {BaseUrl} from "../../BaseUrl";
import MyClaims from './claims'
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = theme => ({
    paper: {
        margin:20,
    },
})
class Profile extends Component {

    static propTypes = {
        getUserDiscussions: PropTypes.func.isRequired,
        getUserClaims: PropTypes.func.isRequired
    };

    handleClick(e) {
        this.setState({
            ...this.state, toDiscussion: e
        })
        this.props.selectDiscussion(e)
    }


    handleChange = (event, value) => {
        this.setState({value});
    };

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            discussions: [],
            toDiscussion: -1,
            toEditDiscussion: -1,
            value:0,
            AddDialog:false,
            name:'',
            change:true,
            successopen: false,
            erroropen: false,
            errormes: ''
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.props.getUserDiscussions(this.props.user.id);
        this.props.getUserClaims(this.props.user.id)
    }

    async create(){
        let self = this;
        let formData = new FormData();
        formData.append('teamId', self.state.name);
        await axios({
            method: 'post',
            url:`${BaseUrl}/api/teams/`,
            data:formData,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        }).then(function (result) {
            console.log(result)
            self.setState({change: !self.state.change, AddDialog: false, successopen:true})
        }).catch(function (err, response) {
            console.log(err.response.data.teamId)
            if(err.response.data.teamId) {
                self.setState({erroropen: true, errormes: 'این نام تکراریست'})
            }else {
                self.setState({erroropen: true, errormes: 'مشکلی رخ داده است'})
            }
        })
    }

    render() {
        const {value} = this.state;
        const {classes} = this.props
        this.props.userClaims.sort((a, b) => (a.type > b.type) ? 1 : -1)
        // const claimsList = !this.props.loading ? "loading..." : this.userClaims(this.props.userClaims)
        return (
            <div className='app-wrapper'>
                <ContainerText title='پروفایل کاربری'/>
                <Card className="shadow border-0" >
                    <h5 className=''><b>اطلاعات شما</b></h5>
                    <span className = ''></span>
                    <span className = ''>نام کاربری: {this.props.user.username}</span>
                    <span className = ''>ایمیل: {this.props.user.email}</span>
                </Card>
                <div className={classes.paper}>
                    <Paper elevation={3} >
                        <div className='flex-column justify-content-around col-12 d-flex flex-column'>
                            <h5 className='align-self-start p-3'><b>
                                بحث های شما</b></h5>
                            {/* {discussionList} */}
                            <Discussions history={this.props.history} />
                        </div>
                    </Paper>
                </div>
                <div className={classes.paper}>
                    <Paper elevation={3} >
                        <div className='flex-column justify-content-around col-12 d-flex'>
                            <div className='align-self-start p-3 flex-row d-flex w-100 justify-content-between'>
                                <h5 className='align-self-start p-3'><b>
                                    تیم های من</b></h5>
                                <IconButton onClick={()=>this.setState({AddDialog:true})}>
                                    <AddIcon/>
                                </IconButton>
                            </div>
                                <UserTeams change={this.state.change}/>
                        </div>
                    </Paper>
                </div>
                <div className={classes.paper}>
                    <Paper elevation={3} >
                    <div className='flex-column justify-content-around col-12 d-flex flex-column'>
                {/* <Card className="shadow border-15" style = {{alignItems:'center'}}> */}
                        <h5 className='align-self-start p-3'><b>ادعاهای شما</b></h5>
                        <div>
                            <AppBar position="static">
                                <Tabs 
                                value={value} 
                                onChange={this.handleChange} 
                                aria-label="simple tabs example">
                                    <Tab label="خنثی" {...a11yProps(0)} />
                                    <Tab label="مثبت" {...a11yProps(1)} />
                                    <Tab label="منفی" {...a11yProps(2)} />
                                </Tabs>
                            </AppBar>
                            <TabPanel value={value} index={0}>
                                <MyClaims claims={this.props.userClaims} model='خنثی' num={0}/>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <MyClaims claims={this.props.userClaims} model='مثبت' num={1}/>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <MyClaims claims={this.props.userClaims} model='منفی' num={2}/>
                            </TabPanel>
                        </div>
                    {/* {claimsList} */}
                {/* </Card> */}
                    </div>
                    </Paper>
                </div>
                <Dialog
                    open={this.state.AddDialog}
                    onClose={()=>this.setState({AddDialog: false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"اضافه کردن تیم کاربری"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            یک نام برای تیم کاربری انتخاب کنید.
                        </DialogContentText>
                        <TextField value={this.state.name} id="standard-basic" placeholder="نام" fullWidth multiline onChange={(e)=> this.setState({name: e.target.value})}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>this.setState({AddDialog: false})} color="primary">
                            لغو
                        </Button>
                        <Button onClick={()=>this.create()} color="primary" autoFocus>
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.successopen} autoHideDuration={3000} onClose={() => this.setState({successopen: false})}>
                    <Alert onClose={() => this.setState({successopen: false})} severity="success">
                        تیم جدید اضافه شد.
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false})}>
                    <Alert onClose={() => this.setState({erroropen: false})} severity="error">
                        {this.state.errormes}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    discussions: state.discussions.discussions,
    loading: state.discussions.loading,
    selectedDiscussion: state.discussions.selectedDiscussion,
    user: state.auth.user,
    claims:state.claims.claims,
    userClaims:state.claims.userClaims
});

export default connect(
    mapStateToProps,
    { getUserDiscussions ,getUserClaims, selectDiscussion, suggestedListrDialog}
)(withStyles(useStyles) (Profile));
