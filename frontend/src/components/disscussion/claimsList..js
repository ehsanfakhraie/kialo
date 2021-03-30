import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Container, Col } from 'reactstrap';
import '../css/claimsList.css'
import {addClaim, selectClaim, typeSelect, updateClaims} from "../../actions/claims";
import PropTypes from "prop-types";
import {addClaimDialog} from "../../actions/diaog";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Comment from "../../widget/Comment";
import Vote from "../../widget/Vote";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import ChatIcon from '@material-ui/icons/Chat';
import history from "../../historyForRouter/history";
import HelpIcon from '@material-ui/icons/Help';
import ShareIcon from '@material-ui/icons/Share'
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import LinkIcon from '@material-ui/icons/Link';
import ListItemText from "@material-ui/core/ListItemText";
import {BaseUrlFront} from "../../BaseUrl";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FlagIcon from '@material-ui/icons/Flag';
import Flag from "../../widget/flag";


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class ClaimsList extends Component {
    static propTypes = {
        claims: PropTypes.array.isRequired,
        selectClaim: PropTypes.func.isRequired,
        updateClaims: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            claims: [],
            commentClicked:null,
            comment:'',
            value: 0,
            showInfo:false,
            copied:false,
            firstClaim:null,
            link:null
        };

    }
    async componentDidMount() {
        if(this.props.queryClaim != null){
            for(let i in this.props.discussion.claims){
                if(this.props.discussion.claims[i].id == this.props.queryClaim){
                    this.props.selectClaim(this.props.discussion.claims[i].id);
                    await this.setState({firstClaim: this.props.discussion.claims[0].id})
                    if(this.props.discussion.claims[i].link!= ''){
                        await this.setState({link: this.props.discussion.claims[i].link})
                    }
                }
            }
        }else{
            this.props.selectClaim(this.props.discussion.claims[0].id);
            await this.setState({firstClaim: this.props.discussion.claims[0].id})
            if(this.props.discussion.claims[0].link!= ''){
                await this.setState({link: this.props.discussion.claims[0].link})
            }
        }
        console.log('rea', this.props.discussion.type)
    }
    componentDidUpdate(prevProps) {
        if(prevProps.selectedClaim !== this.props.selectedClaim){
            let selectedClaim = search(this.props.claims, this.props.selectedClaim);
            this.props.typeSelect(selectedClaim.type)
            history.replace({
                pathname: `/discussion/${this.props.discussion.id}/`,
                search: `?claim=${this.props.selectedClaim}`
            });
        }
    }


    render() {
        console.log(this.state.value);
        var text;
        var reply;
        var link;
        var pros=[];
        var cons=[];
        var norm=[]
        var prosMaped;
        var consMaped;
        var normMaped;

        if (search(this.props.claims, this.props.selectedClaim) !== null) {
            console.log('testssssssssssss', this.props.claims)
            var selectedClaim = search(this.props.claims, this.props.selectedClaim);
            text = selectedClaim.text;
            reply = selectedClaim['in_reply_to']
            link = selectedClaim['link']
            console.log('reply:::',link)
            if (selectedClaim['children'] != null) {

                pros = Array.from(selectedClaim['children']).filter(function (el) {
                    return el.type == 1
                })
                cons = Array.from(selectedClaim['children']).filter(function (el) {
                    return el.type == 2
                })
                norm = Array.from(selectedClaim['children'].filter(function (el) {
                    return el.type == 0
                }))
                var self = this;
                normMaped = norm.map(function (claim) {
                    return (
                        <div >
                            <div className={'claim'}>
                                <Row className='column-box'  onClick={()=>{
                                    history.push({
                                        pathname: `/discussion/${self.props.discussion.id}/`,
                                        search: `?claim=${claim.id}`
                                    });
                                    self.props.selectClaim(claim.id)}}>
                                    {claim.text}
                                </Row>
                            </div>
                        </div>
                    )
                })
                prosMaped = pros.map(function (claim) {
                    return (
                        <div >
                            <div className={'claim'}>
                                <Row className='column-box'  onClick={()=>{
                                    history.push({
                                        pathname: `/discussion/${self.props.discussion.id}/`,
                                        search: `?claim=${claim.id}`
                                    });
                                    self.props.selectClaim(claim.id)}}>
                                    {claim.text}
                                </Row>
                            </div>
                        </div>
                    )
                })
                consMaped = cons.map(function (claim) {
                    return (
                        <div >
                            <div className={'claim'}>
                                <Row className='column-box'  onClick={()=>{
                                    history.push({
                                        pathname: `/discussion/${self.props.discussion.id}/`,
                                        search: `?claim=${claim.id}`
                                    });
                                    self.props.selectClaim(claim.id)}}>
                                    {claim.text}
                                </Row>
                            </div>
                        </div>
                    )
                })
            }


        }
        var shart =((this.props.discussion.type === 1))
        console.log('hey', shart)
        var clHeader =<Row style={{padding:0 }}>
        { (this.props.discussion.type === 1 || ((this.props.discussion.type === 2) && this.state.firstClaim !== this.props.selectedClaim)) &&
        <Col className='column-box'>
            <span className='pros'>ادعای مثبت</span>
            <button className='pros-btn' title="" onClick={() => {
                if(localStorage.getItem('token') != undefined) {
                    this.props.addClaimDialog(1)
                }else {
                    history.push({
                        pathname: `/login`,
                    });
                    window.location.reload(false)
                }
            }}><i className="fa fa-plus-square"></i></button>
        </Col>
        }
            {(this.props.discussion.type === 1 || ((this.props.discussion.type === 2) && this.state.firstClaim !== this.props.selectedClaim)) &&
            <Col className='column-box'>
                <span className='cons'>ادعای منفی</span>
                <button className='cons-btn' title="" onClick={() => {
                    if (localStorage.getItem('token') != undefined) {
                        this.props.addClaimDialog(2)
                    } else {
                        history.push({
                            pathname: `/login`,
                        });
                        window.location.reload(false)
                    }
                }}><i className="fa fa-plus-square"></i>
                </button>
            </Col>
            }
            {((this.props.discussion.type === 2) && this.state.firstClaim === this.props.selectedClaim) &&
                <Col className='column-box'>
                <span className='norm'>ادعای خنثی</span>
                <button className='norm-btn' title="" onClick={() => {
                if (localStorage.getItem('token') != undefined) {
                    this.props.addClaimDialog(0)
                } else {
                    history.push({
                        pathname: `/login`,
                    });
                    window.location.reload(false)
                }
            }}><i className="fa fa-plus-square"></i>
                </button>
                </Col>
            }
        </Row>


        return (
            <Container>
                <div className='claims-list'>
                    <Row style={{padding:0 }}>
                        <div className='claim header-claim d-flex flex-row justify-content-between align-items-center' onClick={()=>this.setState({commentClicked:(this.props.selectedClaim !== this.state.commentClicked)
                                ? this.props.selectedClaim
                                : null})}>
                            <div className='d-flex flex-column text-right'>
                                <span>
                                    {(reply != null)?<h5>
                                        در جواب به ادعای<a href={`${BaseUrlFront}/discussion/${this.props.id}/?claim=${reply}`} onClick={(e)=> e.stopPropagation()}> #{reply}:</a><br/>
                                    </h5>:null}
                                    
                                    {' '}{text}<ExpandMoreIcon style={{alignSelf:'end'}}/>
                                </span>
                                {(link != null && link != '') &&
                               
                                <h5>
                                     <br/>
                                    <a href={link}
                                                   onClick={event => event.stopPropagation()}>پیوند الحاقی</a>
                                </h5>
                                }
                            </div>
                            <IconButton onClick={(e)=>{
                                e.stopPropagation()
                                this.setState({showInfo:true})
                            }} >
                                <ShareIcon color='primary' style={{width:'5vh', height:'5vh'}}/>
                            </IconButton>

                        </div>
                        {this.state.commentClicked === this.props.selectedClaim &&
                        <div className={'commentList'}>
                            <AppBar position="static" style={{backgroundColor: "#212529"}}>
                                <Tabs  aria-label="simple tabs example" value={this.state.value} onChange={(e, newValue)=> this.setState({value: newValue})}>
                                    <Tab icon={<ChatIcon/>}  id={`simple-tab-${0}`} aria-controls= {`simple-tabpanel-${0}`} />
                                    <Tab icon={<HowToVoteIcon/>} id={`simple-tab-${1}`} aria-controls= {`simple-tabpanel-${1}`}/>
                                    <Tab icon={<FlagIcon/>} id={`simple-tab-${2}`} aria-controls= {`simple-tabpanel-${2}`} />
                                </Tabs>
                            </AppBar>
                            {this.state.value === 0 &&
                                <Comment data={this.state.data} claimSelect={this.props.selectedClaim}/>
                            }
                            {this.state.value === 1 &&
                                <Vote type={this.props.type} claims={this.props.selectedClaim}/>
                            }
                            {this.state.value === 2 &&
                                <Flag claimSelect={this.props.selectedClaim}/>
                            }
                        </div>
                        }
                        <div className="column-headers">

                            {clHeader}

                        </div>
                    </Row>
                    <Row style={{padding:0 }}>
                        {(this.props.discussion.type === 1 || ((this.props.discussion.type === 2) && this.state.firstClaim !== this.props.selectedClaim)) &&
                        <Col>
                            {prosMaped}
                        </Col>
                        }
                        {(this.props.discussion.type === 1 || ((this.props.discussion.type === 2) && this.state.firstClaim !== this.props.selectedClaim)) &&
                        <Col>
                            {consMaped}
                        </Col>
                        }
                        {((this.props.discussion.type === 2) && this.state.firstClaim === this.props.selectedClaim) &&
                        <Col>
                            {normMaped}
                        </Col>
                        }
                    </Row>

                </div >
                <Dialog onClose={()=>this.setState({showInfo:false})} aria-labelledby="simple-dialog-title" open={this.state.showInfo}>
                    <DialogTitle id="simple-dialog-title">لینک این ادعا</DialogTitle>
                    <List>
                        <CopyToClipboard text={`${BaseUrlFront}discussion/${this.props.id}/?claim=${this.props.selectedClaim}`}
                                         onCopy={() => this.setState({copied: true})}>
                        <ListItem autoFocus button>
                            <ListItemAvatar>
                                <Avatar>
                                    <LinkIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${BaseUrlFront}discussion/${this.props.id}/?claim=${this.props.selectedClaim}`} />
                        </ListItem>
                        </CopyToClipboard>
                    </List>
                </Dialog>
                <Snackbar open={this.state.copied} autoHideDuration={2000} onClose={() => this.setState({copied: false})}>
                    <Alert onClose={() => this.setState({copied: false})} severity="success">
                        کپی شد
                    </Alert>
                </Snackbar>
            </Container >

        );
    }
    search(element, matchingId) {
        if (element.id == matchingId) {
            return element;
        } else if (element.children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
                result = search(element.children[i], matchingId);
            }
            return result;
        }
        return null;
    }
}

const mapStateToProps = state => ({
    selectedClaim: state.claims.selectedClaim,
    claims: state.claims.claims,
    type: state.claims.type,
    mine: state.claims
});

function search(element, matchingId) {
    console.log('element::',element)
    if (element.id == matchingId) {
        return element;
    } else if (element.children != null) {
        var i;
        var result = null;
        for (i = 0; result == null && i < element.children.length; i++) {
            result = search(element.children[i], matchingId);
        }
        console.log('result::',result)
        return result;
    }
    return null;
}

export default connect(
    mapStateToProps,
    { addClaim, selectClaim, updateClaims, addClaimDialog, typeSelect }
)(ClaimsList);
