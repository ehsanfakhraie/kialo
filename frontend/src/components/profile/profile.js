import React, { Component } from 'react';
import {getUserDiscussions, selectDiscussion} from "../../actions/discussion"
import {getUserClaims} from "../../actions/claims"
// import { loadUser } from "../../actions/auth"
// import DiscussionList from '../../components/discussionList';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink, useHistory, Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, CardBody, CardText, CardSubtitle, CardImg, CardTitle, Button, Form } from "reactstrap";
import './profile.css'
import '../../styles/main-content.scss'
import ContainerText from '../layout/containertext' 
import editDiscussion from '../disscussion/editDiscussion';
import SuggestedList from "../../widget/SuggestedList";
import {suggestedListrDialog} from "../../actions/diaog";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( theme => ({
    paper: {
        padding:'20px',
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(1),
          width: theme.spacing(14),
          height: theme.spacing(16),
        },
    },
}))
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

    handleEditClick(id){
        this.setState({
            ...this.state,  toEditDiscussion: id
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            discussions: [],
            toDiscussion: -1,
            toEditDiscussion: -1
        }
        this.handleClick = this.handleClick.bind(this);
    }

    async handleSuggehstClick(id){
        await this.setState({selected: id})
        console.log(this.state.selected)
        this.props.suggestedListrDialog()
    }

    componentWillMount() {
        this.props.getUserDiscussions(this.props.user.id)
        this.props.getUserClaims(this.props.user.id)
    }

    userDiscussions(discussions) {
        //const text = this.props.discussions.map(discussion => this.renderCard(discussion))
        const col1 = [];
        discussions.map(discussion => col1.push(discussion))

        var out = [];
        for (let i = 0; i < col1.length; i += 3) {
            if (i + 2 < col1.length)
                out.push(<Row>
                    {this.renderCard(col1[i])}
                    {this.renderCard(col1[i + 1])}
                    {this.renderCard(col1[i + 2])}
                </Row>)
            else if (i + 1 < col1.length)
                out.push(<Row>
                    {this.renderCard(col1[i])}
                    {this.renderCard(col1[i + 1])}
                </Row>)
            else
                out.push(<Row>
                    {this.renderCard(col1[i])}
                </Row>)
            out.push(<br />);
            out.push(<br />);
        }
        return out;
    }

    userClaims(claims) {
        //const text = this.props.discussions.map(discussion => this.renderCard(discussion))
        const col1 = [];
        claims.map(claim => col1.push(claim))

        var out = [];
        for (let i = 0; i < col1.length; i += 3) {
            if (i + 2 < col1.length)
                out.push(<Row>
                    {this.renderClaim(col1[i])}
                    {this.renderClaim(col1[i + 1])}
                    {this.renderClaim(col1[i + 2])}
                </Row>)
            else if (i + 1 < col1.length)
                out.push(<Row>
                    {this.renderClaim(col1[i])}
                    {this.renderClaim(col1[i + 1])}
                </Row>)
            else
                out.push(<Row>
                    {this.renderClaim(col1[i])}
                </Row>)
            out.push(<br />);
            out.push(<br />);
        }
        return out;
    }

    renderCard(d) {
        //console.log('DDDD:',d)
        return (
            <Card className="shadow border-0" style = {{alignItems:'start',width:'25vw'}} key={d.id}>
                <div style={{width: '100%', height: '23vw', overflow: 'hidden'}}>
                    <CardImg style={{height:'100%'}} src={d.photo} alt="Card image cap"/>
                </div>
                <CardBody className='align-self-start'>
                    <h3 className="card-title align-self-start">{d.title}</h3>
                    <CardSubtitle>Created by: {d.owner.username}</CardSubtitle>
                    <CardText>{d.text.trim(100)}</CardText>
                    <Button variant="contained" className="bg-primary text-white w-100" style={{margin:'10px'}} onClick={() => this.handleClick(d.id)}>Info</Button>
                    <Button onClick={() =>  this.handleEditClick(d.id)} variant="contained" className="text-white w-100" style={{margin:'10px'}}>
                        edit
                    </Button>
                    <Button onClick={() =>  this.handleSuggehstClick(d.id)} variant="contained" className="text-white w-100" style={{margin:'10px'}}>
                        suggests
                    </Button>
                </CardBody>
            </Card>
        )
    }

    renderClaim(c) {
        var span;
        if(c.type==0){
            span=<span className='norm' >Normal</span>
        }else if(c.type==1){
            span=<span className='cons2' >Negetive</span>
        }else if(c.type==2){
            span=<span className='pros2' >Posetive</span>
        }
        console.log('CCCC:',c)
        return (
            <Card className="shadow border-0"  key={c.id}>
                <Col className='column-box'>
                    {span}
                    <button className='cons-btn' title="" >
                    </button>
                </Col>        
                <CardBody>
                <b className="card-title">In Discussion: {c.for_discussion}</b>
                <CardText>{c.text}</CardText>
                <Button variant="contained" className="bg-primary text-white" onClick={() => this.handleClick(c.for_discussion)}>Go to discussion</Button>
                </CardBody>
            </Card>
        )
    }

    render() {
        if (this.state.toDiscussion !== -1) {
            return <Redirect to={"discussion/" + this.state.toDiscussion + '/'} />
        }else if(this.state.toEditDiscussion !== -1){
            return <Redirect to={"edit-discussion/" + this.state.toEditDiscussion + '/'} />
        }
        const discussionList = !this.props.loading ? "loading..." : this.userDiscussions(this.props.discussions)
        this.props.userClaims.sort((a, b) => (a.type > b.type) ? 1 : -1)
        const claimsList = !this.props.loading ? "loading..." : this.userClaims(this.props.userClaims)
        console.log('USERS:',this.props.user)
        return (
            <div className='app-wrapper'>
                <ContainerText title='Profile'/>
                <Card className="shadow border-0">
                    <h5 className='align-self-start'><b>Informations</b></h5>
                    <span className = 'information'>{this.props.user.username}</span>
                    <span className = 'information'>my id:{this.props.user.id}</span>
                    <span className = 'information'>{this.props.user.email}</span>
                </Card>
                <div className = {useStyles.paper} style={{marginRight:'20px',marginLeft:'20px'}}>
                    <Paper elevation={3} >
                    <div className='row justify-content-around col-12'>
                    <h5 className='align-self-start'><b> Discussions </b></h5>
                    {discussionList}
                    </div>
                    </Paper>
                </div>
                <Card className="shadow border-15" style = {{alignItems:'center'}}>
                    <h5 className='align-self-start'><b>Claims</b></h5>
                    {claimsList}
                </Card>
                <SuggestedList claims={this.state.selected}/>
            </div>
        );
    }
}

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
)(Profile);