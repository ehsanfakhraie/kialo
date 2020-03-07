import React from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {CardImg} from "reactstrap";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ContainerText from '../layout/containertext' 
import Paper from '@material-ui/core/Paper';
import '../../styles/main-content.scss'
import {BaseUrl} from "../../BaseUrl";
import discussions from "../../reducers/discussions";
import {connect} from "react-redux";
import {suggestedListrDialog} from "../../actions/diaog";
import SuggestedList from "../../widget/SuggestedList";
import {Redirect} from "react-router-dom";

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
    root: {
      minWidth: 345,
    },
    media: {
        height: 140,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
}));

class MyDiscussion extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            myDiscussions:{},
            allDiscussions: {},
            toDiscussion:null
        }
    }

    async componentDidMount() {
        var a = await axios({
            method: 'get',
            url:`${BaseUrl}/api/userDiscussions/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        });
        console.log('AAAA:::',a)
        var b = await axios({
            method: 'get',
            url: `${BaseUrl}/api/discussions/`,
        });
        await this.setState({myDiscussions: a})
        await this.setState({allDiscussions: b})
    }

    async handleDialog(discussion){
        await this.setState({selected: discussion})
        console.log(this.state.selected)
        this.props.suggestedListrDialog()
    }

    render() {
        if (this.state.toDiscussion !== null) {
            return <Redirect to={"discussion/" + this.state.toDiscussion + '/'} />
        }
        console.log('MYDICUSSION::',this.state.myDiscussions,'ALLDISCUSSION::',this.state.allDiscussions)
        return(
            <div className='app-wrapper'>
                <ContainerText title='My Discussion'/>
                <div className = {useStyles.paper} style={{marginRight:'20px',marginLeft:'20px'}}>
                    <Paper elevation={3} >
                    <div className='row justify-content-start p-5 col-12'>
                        {(this.state.allDiscussions.data != undefined)?
                            this.state.allDiscussions.data.map((discussion) => {
                                return(
                                    this.state.myDiscussions.data[0].manager.map((myManagerId) => {
                                        if(discussion.id == myManagerId) {
                                        //  console.log('discussion.id',discussion.id,'myManagerId',myManagerId)
                                            return(
                                                    <div className='col-md-4 col-sm-12'>
                                                        <Card className={useStyles.root}>
                                                            <CardActionArea onClick={()=>this.handleDialog(discussion.id)}>
                                                                <div style={{width:'80%',height:'42vh',overflow:'hidden',marginLeft:'10%'}}>
                                                                    <CardImg
                                                                        style={{height:'100%'}}
                                                                        src={discussion.photo}
                                                                    />
                                                                </div>
                                                                <CardContent>
                                                                <Typography gutterBottom className={useStyles.title} variant="h5" component="h2">
                                                                    {discussion.title}
                                                                </Typography>
                                                                <Typography className={useStyles.pos} color="textSecondary">
                                                                    As manager
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    {discussion.text}
                                                                </Typography>
                                                                </CardContent>
                                                            </CardActionArea>
                                                            <CardActions>
                                                                <Button size="small" color="primary" onClick={()=> this.setState({...this.state,  toDiscussion: discussion.id})}>
                                                                    Info
                                                                </Button>
                                                            </CardActions>
                                                        </Card>
                                                    </div>
                                            )
                                        }
                                    })
                                )
                            }):null
                        }
                    </div>
                    <div className='row justify-content-around p-5 col-12'>
                        {(this.state.allDiscussions.data != undefined)?
                            this.state.allDiscussions.data.map((discussion) => {
                                return(
                                    this.state.myDiscussions.data[0].writer.map((myManagerId) => {
                                        if(discussion.id == myManagerId) {
                                        //  console.log('discussion.id',discussion.id,'myManagerId',myManagerId)
                                            return(
                                                    <div className='col-md-4 col-sm-12'>
                                                        <Card className={useStyles.root}>
                                                            <CardActionArea onClick={()=>this.handleDialog(discussion.id)}>
                                                                <div style={{width:'80%',height:'42vh',overflow:'hidden', marginLeft:'10%'}} >
                                                                    <CardImg
                                                                        style={{height:'100%'}}
                                                                        src={discussion.photo}
                                                                    />
                                                                </div>
                                                                <CardContent>
                                                                <Typography gutterBottom className={useStyles.title} variant="h5" component="h2">
                                                                    {discussion.title}
                                                                </Typography>
                                                                <Typography className={useStyles.pos} color="textSecondary">
                                                                    As writer
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    {discussion.text}
                                                                </Typography>
                                                                </CardContent>
                                                            </CardActionArea>
                                                            <CardActions>
                                                                <Button size="small" color="primary" onClick={()=> this.setState({...this.state,  toDiscussion: discussion.id})}>
                                                                    Info
                                                                </Button>
                                                            </CardActions>
                                                        </Card>
                                                    </div>
                                            )
                                        }
                                    })
                                )
                            }):null
                        }
                    </div>
                    <div className='row justify-content-around p-5 col-12'>
                        {(this.state.allDiscussions.data != undefined)?
                            this.state.allDiscussions.data.map((discussion) => {
                                return(
                                    this.state.myDiscussions.data[0].editor.map((myManagerId) => {
                                        if(discussion.id == myManagerId) {
                                        //  console.log('discussion.id',discussion.id,'myManagerId',myManagerId)
                                            return(
                                                    <div className='col-md-4 col-sm-12'>
                                                        <Card className={useStyles.root} >
                                                            <CardActionArea onClick={()=>this.handleDialog(discussion.id)}>
                                                                <div style={{width:'70%',height:'42vh',overflow:'hidden',marginLeft:'10%'}} >
                                                                    <CardImg
                                                                        style={{height:'100%'}}
                                                                        src={discussion.photo}
                                                                    />
                                                                </div>
                                                                <CardContent>
                                                                <Typography gutterBottom className={useStyles.title} variant="h5" component="h2">
                                                                    {discussion.title}
                                                                </Typography>
                                                                <Typography className={useStyles.pos} color="textSecondary">
                                                                    As editor
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    {discussion.text}
                                                                </Typography>
                                                                </CardContent>
                                                            </CardActionArea>
                                                            <CardActions>
                                                                <Button size="small" color="primary" onClick={()=> this.setState({...this.state,  toDiscussion: discussion.id})}>
                                                                    Info
                                                                </Button>
                                                            </CardActions>
                                                        </Card>
                                                    </div>
                                            )
                                        }
                                    })
                                )
                            }):null
                        }
                    </div>
                    </Paper>
                    <SuggestedList claims={this.state.selected}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({dialog, discussions}) => {
    console.log('dialog::', discussions)
    return {dialog}
};
export default connect(
    mapStateToProps,
    {suggestedListrDialog}
)(MyDiscussion);