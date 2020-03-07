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



var data =[{name:'ali', com:'nice'}, {name:'reza', com: 'did you think ever?'}]

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
        };

    }
    componentDidMount() {
        this.props.selectClaim(this.props.discussion.claims[0].id)
        console.log('rea', this.props.discussion.claims[0])
    }
    componentDidUpdate(prevProps) {
        if(prevProps.selectedClaim !== this.props.selectedClaim){
            let selectedClaim = search(this.props.claims, this.props.selectedClaim);
            console.log('ssss',selectedClaim)
            this.props.typeSelect(selectedClaim.type)
        }
    }


    render() {
        console.log(this.state.value);
        var text;
        var pros=[];
        var cons=[];
        var prosMaped;
        var consMaped;

        if (search(this.props.claims, this.props.selectedClaim) !== null) {
            var selectedClaim = search(this.props.claims, this.props.selectedClaim);
            text = selectedClaim.text;
            if (selectedClaim['children'] != null) {

                pros = Array.from(selectedClaim['children']).filter(function (el) {
                    return el.type == 1
                })
                cons = Array.from(selectedClaim['children']).filter(function (el) {
                    return el.type == 2
                })
                var self = this;
                prosMaped = pros.map(function (claim) {
                    return (
                        <div >
                            <div className={'claim'}>
                                <Row className='column-box'  onClick={()=>self.props.selectClaim(claim.id)}>
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
                                <Row className='column-box'  onClick={()=>self.props.selectClaim(claim.id)}>
                                    {claim.text}
                                </Row>
                            </div>
                        </div>
                    )
                })
            }


        }

        var clHeader =<Row style={{padding:0 }}><Col className='column-box'>
            <span className='pros'>Pros</span>
            <button className='pros-btn' title="" onClick={() => this.props.addClaimDialog(1)}><i className="fa fa-plus-square"></i></button>
        </Col>
            <Col className='column-box'>
                <span className='cons' >Cons</span>
                <button className='cons-btn' title="" onClick={() => this.props.addClaimDialog(2)}><i className="fa fa-plus-square"></i>
                </button>
            </Col></Row>


        return (
            <Container>
                <div className='claims-list'>
                    <Row style={{padding:0 }}>
                        <div className='claim header-claim ' onClick={()=>this.setState({commentClicked:(this.props.selectedClaim !== this.state.commentClicked)
                                ? this.props.selectedClaim
                                : null})}>
                            {text}<ExpandMoreIcon style={{alignSelf:'end'}}/>
                        </div>
                        {this.state.commentClicked === this.props.selectedClaim &&
                        <div className={'commentList'}>
                            <AppBar position="static" style={{backgroundColor: "#212529"}}>
                                <Tabs  aria-label="simple tabs example" value={this.state.value} onChange={(e, newValue)=> this.setState({value: newValue})}>
                                    <Tab icon={<ChatIcon/>}  id={`simple-tab-${0}`} aria-controls= {`simple-tabpanel-${0}`} />
                                    <Tab icon={<HowToVoteIcon/>} id={`simple-tab-${1}`} aria-controls= {`simple-tabpanel-${1}`}/>
                                    {/*<Tab label="Item Three"  />*/}HowToVoteIcon
                                </Tabs>
                            </AppBar>
                            {this.state.value === 0 &&
                                <Comment data={this.state.data} claimSelect={this.props.selectedClaim}/>
                            }
                            {this.state.value === 1 &&
                                <Vote type={this.props.type} claims={this.props.selectedClaim}/>
                            }
                        </div>
                        }
                        <div className="column-headers">

                            {clHeader}

                        </div>
                    </Row>
                    <Row style={{padding:0 }}>
                        <Col>
                            {prosMaped}
                        </Col>
                        <Col>
                            {consMaped}
                        </Col>
                    </Row>

                </div >

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

export default connect(
    mapStateToProps,
    { addClaim, selectClaim, updateClaims, addClaimDialog, typeSelect }
)(ClaimsList);
