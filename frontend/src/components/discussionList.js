import React, { Component } from 'react';
import axios from "axios";
import {CardImg} from "reactstrap";
import {BrowserRouter as Router,Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import '../styles/main-content.scss'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ContainerText from '../components/layout/containertext' 
import Paper from '@material-ui/core/Paper';
import {BaseUrl} from "../BaseUrl";


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

class DiscussionList extends Component {


    static propTypes = {
        discussions: PropTypes.array.isRequired,
        loading: PropTypes.bool,
        getDiscussions: PropTypes.func.isRequired,
        selectDiscussion:PropTypes.func.isRequired
    };

    constructor(props) {
        super(props)
        this.state = {
            allDiscussions: {},
            loading: true,
            discussions: [],
            toDiscussion: -1
        }
        this.handleClick = this.handleClick.bind(this);
    }


    async componentDidMount() {
        var b = await axios({
            method: 'get',
            url: BaseUrl+'/api/discussions/',
        });
        await this.setState({allDiscussions: b})
    }

    handleClick(e) {
        console.log(e)
        this.setState({
            ...this.state, toDiscussion: e
        })
        this.props.selectDiscussion(e)
    }

    render() {
        if (this.state.toDiscussion !== -1) {
            return <Redirect to={"discussion/" + this.state.toDiscussion+'/'} />
        }
        return (
            <div className='app-wrapper'>
                <ContainerText title='Home'/>
                <div className = {useStyles.paper} style={{marginRight:'20px',marginLeft:'20px'}}>
                    <Paper elevation={3} >
                        <div className='row justify-content-start col-12'>
                            {(this.state.allDiscussions.data != undefined)?
                                this.state.allDiscussions.data.map((discussion) => {
                                    return(
                                        <div className='col-sm-12 col-md-4 p-3'>
                                            <Card className={useStyles.root}>
                                                <CardActionArea>
                                                    <div style={{margin:'10%',width:'80%',height:'42vh',overflow:'hidden'}}>
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
                                                            Created by: {discussion.owner.username}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            {discussion.text.trim(100)}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                                <CardActions>
                                                    <Button size="small" color="primary" onClick={() => this.handleClick(discussion.id)}>
                                                        Info
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </div> 
                                    )
                                }):null
                            }
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default DiscussionList