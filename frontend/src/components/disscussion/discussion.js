import React, { Component } from 'react';
import { connect } from 'react-redux';
import CChart from './chart';
import ClaimsList from './claimsList.';
import {Card, Button } from "reactstrap";
import AddClaimDialog from "../../widget/AddClaimDialog";
import {BaseUrl, BaseUrlFront} from "../../BaseUrl";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import queryString from 'query-string'
import InfoIcon from '@material-ui/icons/Info';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Fab from "@material-ui/core/Fab";
import '../css/claimsList.css';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class Discussion extends Component {
    constructor(data) {
        super();
        this.state = {
            loading:true,
            id: 0, discussion: {
                claims: [],
                open:false,
                queryClaim:null,
                toDiscussion: null,
                openDiscussion:false
            }
        };
    }

    async componentDidMount() {
        console.log('loc::', isNaN(parseInt(queryString.parse(this.props.location.search).claim)));

        if(!isNaN(parseInt(queryString.parse(this.props.location.search).claim))){
            this.setState({queryClaim: parseInt(queryString.parse(this.props.location.search).claim) })
        }
        const { id } = this.props.match.params
        console.log('di',id)
        if(localStorage.getItem('token')!=undefined) {
            fetch(`${BaseUrl}/api/discussions/` + id, {headers: {Authorization: 'token ' + localStorage.getItem('token')}})
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        discussion: data,
                    })
                    console.log('di', this.state.discussion)
                    this.setState({
                        ...this.state, loading: false
                    })
                })
        }else{
            fetch(`${BaseUrl}/api/discussions/` + id)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        discussion: data,
                    })
                    console.log('di', this.state.discussion)
                    this.setState({
                        ...this.state, loading: false
                    })
                })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.dialog.type !==undefined && prevProps.dialog.type !== this.props.dialog.type && this.props.dialog.type === -1){
            const { id } = this.props.match.params
            console.log('di',id)
            await fetch(`${BaseUrl}/api/discussions/` + id)
                .then(response => response.json())
                .then(async data => {
                    await this.setState({
                        discussion: data,
                    })
                    console.log('di',this.state.discussion)
                    this.setState({
                        ...this.state,loading:false
                    })
                })
        }
        if(prevProps.dialog.error !== this.props.dialog.error && this.props.dialog.error != null){
            this.setState({success: this.props.dialog.error, open:true})
        }
    }


    render() {
        const { id } = this.props.match.params
        const {openDiscussion, discussion} = this.state;
        if(!this.state.loading)
            return (
                <div>
                     <Card className="w-100 d-flex flex-row justify-content-between">
                     <h4 className=''><b>تیتر بحث:</b>   {this.state.discussion.title}</h4>
                     <div>
                         <h4>
                             <b className="ml-3">
                             اطلاعات بحث:   
                             </b>
                             <Fab color="primary" size='medium' aria-label="add" onClick={()=>this.setState({openDiscussion: true})}>
                        <InfoIcon fontSize="large"/>
                    </Fab>
                         </h4>
                     
                     </div>
                     
                    </Card>
                    <br/>
                    
                    <CChart discussion={this.state.discussion}/>
                    <ClaimsList discussion={this.state.discussion} queryClaim={this.state.queryClaim} id={id}/>
                    <AddClaimDialog discussion={this.state.discussion} id={id}/>
                    <Dialog
                        open={openDiscussion}
                        className={'overflowhidden'}
                        onClose={()=>this.setState({openDiscussion:false})}
                        scroll={'body'}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                    >
                        <DialogContent >
                            <img className='rounded-lg align-self-center w-100' src={discussion.photo}/>
                            <DialogContentText style={{color:"black"}}
                                id="scroll-dialog-description"
                                // ref={descriptionElementRef}
                                tabIndex={-1}
                            >
                                <h2 className='my-4'>
                                    {this.state.discussion.title}
                                </h2>
                                <h3 className='my-3'>
                                    ساخته شده توسط: {this.state.discussion.owner.username}
                                </h3>
                                <h4 style={{lineHeight:"150%"}} className='my-2'>
                                    توضیحات: {this.state.discussion.text}
                                </h4>
                                {this.state.discussion.tags.length !== 0 &&
                                <h4 className='my-1'>
                                    <br/>
                                    تگ ها: {this.state.discussion.tags.map((tag, map) => {
                                    return (
                                        <a href={`${BaseUrlFront}search/?tag=${tag}`}>
                                            #{tag}{'  '}
                                        </a>
                                    )
                                })}
                                </h4>}
                                
                                {this.state.discussion.link!=null && this.state.discussion.link.length != 0 &&
                                <h4>
                                    <a href={this.state.discussion.link}>لینک الحاقی</a>
                                </h4>
                                }
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>this.setState({openDiscussion:false})} color="primary">
                                بستن
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar open={this.state.open} autoHideDuration={3000} onClose={() => this.setState({open: false})}>
                        <Alert onClose={() => this.setState({successopen: false})} severity="warning">
                            {this.state.success}
                        </Alert>
                    </Snackbar>
                </div>
            );
        else return(
            <div>
                loading..
            </div>
        )
    }
}
const mapStateToProps = ({dialog, claims}) => {
    console.log('dialog::111', claims)
    return {dialog}
};
export default connect(
    mapStateToProps,
    {}
)(Discussion);
