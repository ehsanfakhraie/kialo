import React from 'react'
import { connect } from "react-redux";
import '../../styles/main-content.scss'
import {addManagerDialog} from "../../actions/diaog";
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import {BaseUrl} from "../../BaseUrl";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Information from "../editDiscussion/information";
import Members from "../editDiscussion/members";
import {InformationDiscussion} from "../../actions/discussion";
import Snackbar from "@material-ui/core/Snackbar";
import Claims from "../editDiscussion/Claims";
import {searchError} from "../../actions/messages";

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
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});


class editDiscussion extends React.Component {

    async openDialog(title) {
        await this.props.addManagerDialog(title)
    }

    constructor() {
        super();
        this.state={
            discussion:null,
            managers:[],
            editors:[],
            writers:[],
            title:'',
            text:'',
            type:'',
            id:'',
            link:'',
            photo:null,
            successopen:false,
            erroropen:false,
            errormes:'',
            claims:[],
            value:0,
            addone:null,
            removeOne:null,
            owner:false,
            tags:[],
            private:false,
            members:[]
        }
    }

    async componentDidMount() {
        const { id } = this.props.match.params
        var a =await axios({
            method: 'get',
            url:`${BaseUrl}/api/discussions/`+ id,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        });
        if(a.data != undefined){
            console.log(a.data)
            this.setState({
                            discussion: a.data,
                            title:a.data.title,
                            text:a.data.text,
                            type:a.data.type,
                            id:a.data.owner.id,
                            managers:a.data.managers,
                            editors:a.data.editors,
                            writers:a.data.writers,
                            members:a.data.members,
                            claims:a.data.claims,
                            owner:(JSON.parse(localStorage.getItem('user')).username === a.data.owner.username),
                            tags:a.data.tags,
                            private:a.data.private,
                            link: a.data.link
                        })
            this.props.InformationDiscussion({}, null)
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dialog.discussions.done){
            if(this.props.dialog.discussions.informationChanges.type === 'member'){
                let name =this.props.dialog.discussions.informationChanges.member;
                let counter =-1;
                for(let i in prevState[name+'s']){
                    if(prevState[name+'s'][i].username === this.props.dialog.discussions.informationChanges.data) {
                        counter = i
                        break;
                    }
                }
                console.log('i:::',counter)
                if((counter !== -1 && this.props.dialog.discussions.informationChanges.add === 1) || (counter === -1 && this.props.dialog.discussions.informationChanges.add === 2)){
                    if(this.props.dialog.discussions.informationChanges.add === 1) {
                        this.setState({
                            erroropen: true,
                            errormes: 'این کاربر در لیست وجود دارد',
                            successopen: false,
                            addone: null,
                            removeOne: null
                        })
                        this.props.InformationDiscussion({}, null)
                    }
                }else{
                    if(this.props.dialog.discussions.informationChanges.add===1) {
                        this.setState({
                            successopen: true,
                            addone: {username: this.props.dialog.discussions.informationChanges.data, type: name + 's'}
                        })
                        this.props.InformationDiscussion({}, null)
                    }if(this.props.dialog.discussions.informationChanges.add===2){
                        this.setState({
                            successopen: true,
                            removeOne: {username: this.props.dialog.discussions.informationChanges.data, type: name + 's', index:counter}
                        })
                        this.props.InformationDiscussion({}, null)
                    }
                }
            }
            else if(this.props.dialog.discussions.informationChanges.type === 'claim') {
                const { id } = this.props.match.params
                var a =await axios({
                    method: 'get',
                    url:`${BaseUrl}/api/discussions/`+ id,
                    headers: {Authorization:'token '+localStorage.getItem('token')},
                });
                if(a.data != undefined){
                    this.setState({
                        successopen: true,
                        discussion: a.data,
                        title:a.data.title,
                        text:a.data.text,
                        type:a.data.type,
                        id:a.data.owner.id,
                        managers:a.data.managers,
                        editors:a.data.editors,
                        writers:a.data.writers,
                        claims:a.data.claims,
                        link: a.data.link
                    })
                    this.props.InformationDiscussion({}, null)
                }
            }else {
                if (this.props.dialog.discussions.informationChanges.title || this.props.dialog.discussions.informationChanges.text || this.props.dialog.discussions.informationChanges.type) {
                    this.setState({
                        title: this.props.dialog.discussions.informationChanges.title,
                        text: this.props.dialog.discussions.informationChanges.text,
                        type: this.props.dialog.discussions.informationChanges.type,
                    })
                }
                if (prevProps.dialog.discussions.mes !== this.props.dialog.discussions.mes && this.props.dialog.discussions.mes != null){
                    this.setState({successopen: true})
                }
                this.props.InformationDiscussion({}, null)
            }
        }
        if (prevProps.dialog.errors.searchError !== this.props.dialog.errors.searchError && this.props.dialog.errors.searchError != null){
            this.setState({erroropen: true, errormes: this.props.dialog.errors.searchError})
            this.props.searchError(null)
        }


    }


    render() {
        const { id } = this.props.match.params;
        const { classes } = this.props;
        return(

            <div className={classes.root}>
                <AppBar position="static">

                    <Tabs value={this.state.value} onChange={(e, newValue)=> this.setState({value: newValue})} aria-label="simple tabs example">
                        <Tab label="اطلاعات" {...a11yProps(0)} />
                        <Tab label="اعضا" {...a11yProps(1)} />
                        <Tab label="ادعاها" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                    <Information  title={this.state.title} tags={this.state.tags} owner={this.state.owner} text={this.state.text} type={this.state.type} id={id} photo={(this.state.discussion != undefined)? this.state.discussion.photo: null}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <Members managers={this.state.managers} private={this.state.private} members={this.state.members} writers={this.state.writers} editors={this.state.editors} id={id} addone={this.state.addone} removeOne={this.state.removeOne}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    <Claims claims={this.state.claims} link={this.state.link} />
                </TabPanel>
                <Snackbar open={this.state.successopen} autoHideDuration={3000} onClose={() => this.setState({successopen: false})}>
                    <Alert onClose={() => this.setState({successopen: false})} severity="success">
                        بحث با موفیقت به روزرسانی شد
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false})}>
                    <Alert onClose={() => this.setState({erroropen: false})} severity="error">
                        مشکلی رخ داد!
                        {this.state.errormes}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

editDiscussion.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (dialog) => {
    return {dialog}
};

export default connect(
    mapStateToProps,
    {addManagerDialog, InformationDiscussion, searchError}
)(withStyles(useStyles) (editDiscussion))