import React, { Component } from 'react';
import axios from "axios";
import {CardImg} from "reactstrap";
import {BrowserRouter as Router,Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import '../styles/main-content.scss'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ContainerText from '../components/layout/containertext' 
import Paper from '@material-ui/core/Paper';
import '../styles/main-content.scss'
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {BaseUrl} from "../BaseUrl";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {connect} from "react-redux";
import {logout} from "../actions/auth";
import history from "../historyForRouter/history";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = theme => ({
    paper: {
        marginLeft:20,
        marginRight:20,
        direction:'ltr'
    },
    cardGrid: {
        paddingTop: 64,
        paddingBottom: 64,
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
        textAlign:'right'
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: 42,
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class DiscussionList extends Component {


    static propTypes = {
        discussions: PropTypes.array.isRequired,
        loading: PropTypes.bool,
        getDiscussions: PropTypes.func.isRequired,
        selectDiscussion:PropTypes.func.isRequired,
        logout:PropTypes.func.isRequired
    };

    constructor(props) {
        super(props)
        this.state = {
            allDiscussions: [],
            loading: true,
            discussions: [],
            toDiscussion: null,
            total:[],
            successopen:false,
            erroropen:false,
            errormes:'',
            login:false
        }
    }

    async componentDidMount() {
        let self = this;
        // if(localStorage.getItem('user') != undefined){
            await axios({
                method: 'get',
                url: `${BaseUrl}/api/discussions/`,
                headers: {Authorization:'token '+localStorage.getItem('token')},
            }).then(async function (response) {
                await self.setState({allDiscussions: response})
                console.log('done!' , response.data)
                let x =[]
                for(let i in self.state.allDiscussions.data){
                    x[i]=self.state.allDiscussions.data[i].bookmarked
                }
                await self.setState({total: x})
                console.log(self.state.total)
            }).catch(async function (error) {
                await self.props.logout();
                self.setState({login: true})

            })
        // }else{
        //     await axios({
        //         method: 'get',
        //         url: `${BaseUrl}/api/discussions/`,
        //     }).then(async function (response) {
        //         await self.setState({allDiscussions: response})
        //         console.log(response)
        //         let x =[]
        //         for(let i in self.state.allDiscussions.data){
        //             x[i]=self.state.allDiscussions.data[i].bookmarked
        //         }
        //         await self.setState({total: x})
        //         console.log(self.state.total)
        //     })
        // }
    }

    async bookmark(idx, id){
        let self = this;
        await axios({
            method: 'put',
            url:`${BaseUrl}/api/discussions/bookmark/${id}/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        }).then(async function (response) {
            let x = self.state.total;
            x[idx]= !x[idx];
            await self.setState({total: x, successopen:true})
        }).catch(async function (error) {
            await self.setState({errormes: error, erroropen:true})
        })
    }

    render() {
        if (this.state.toDiscussion !== null) {
            return <Redirect to={"discussion/" + this.state.toDiscussion + '/'} />
        }
        if (this.state.login) {
            return <Redirect to={"/login"} />
        }
        const {classes} = this.props;
        return (
            <div className='app-wrapper'>
                <ContainerText title='بحث ها'/>
                <div className={classes.paper}>
                    <Paper elevation={3} >
                        <div className='flex-column justify-content-around col-12 d-flex flex-column p-5'>
                           
                            <Grid container spacing={3}>
                                {(this.state.allDiscussions.data != undefined)?
                                    this.state.allDiscussions.data.map((discussion, idx) => {
                                        return(
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Card  className={classes.card}>
                                                    <CardMedia onClick={() => {this.props.history.push("/discussion/"+discussion.id)}}
                                                        className={classes.cardMedia}
                                                        image={discussion.photo}
                                                    />
                                                    <CardContent style={{textAlign:'right'}}  className={classes.cardContent}>
                                                        <Typography noWrap gutterBottom variant="h5" component="h2">
                                                            {discussion.title}
                                                        </Typography>
                                                        <Typography noWrap>
                                                            {discussion.text}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button size="small" color="primary" onClick={() => {this.props.history.push("/discussion/"+discussion.id)}}>
                                                            ورود به بحث
                                                        </Button>
                                                        {(localStorage.getItem('token') != undefined) &&
                                                            <IconButton onClick={()=> this.bookmark(idx, discussion.id)}>
                                                                {(!this.state.total[idx])?
                                                                    <BookmarkBorderIcon/>
                                                                    :
                                                                    <BookmarkIcon/>
                                                                }
                                                            </IconButton>
                                                        }
                                                    </CardActions>
                                                </Card>
                                            </Grid> 
                                        )
                                    }):null
                                }
                            </Grid>
                        </div>
                    </Paper>
                </div>
                <Snackbar open={this.state.successopen} autoHideDuration={3000} onClose={() => this.setState({successopen: false})}>
                    <Alert onClose={() => this.setState({successopen: false})} severity="success">
                        موفقیت آمیز بود.
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

export default connect(null, {logout})(withStyles(useStyles)(DiscussionList))