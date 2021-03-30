import React from "react";
import queryString from 'query-string'
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
import {BaseUrl,BaseUrlFront} from "../BaseUrl";

const useStyles = theme => ({
    paper: {
        marginLeft:20,
        marginRight:20
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

class Search extends React.Component{
    
    constructor(props) {
        super(props)
        this.state = {
            allDiscussions: {},
            toDiscussion: null,
            type:'جستجو'
        }
    }

    async componentDidMount() {
        console.log("TAG:::",queryString.parse(this.props.location.search).tag)
        if(localStorage.getItem("token")){
            if((queryString.parse(this.props.location.search).search) !== undefined){
                var b = await axios({
                    method: 'get',
                    url: `${BaseUrl}/api/discussions/search?text=${queryString.parse(this.props.location.search).search}`,
                });
                this.setState({type:'جستجو'})
            }else{
                var b = await axios({
                    method: 'get',
                    url: `${BaseUrl}/api/discussions/search?tag=${queryString.parse(this.props.location.search).tag}`,
                });
                this.setState({type:'تگ'})
            }
            await this.setState({allDiscussions: b})      
        }else{
            this.props.history.push("./login")

        }
        
    }


    render() {
        if (this.state.toDiscussion !== null) {
            return <Redirect to={"discussion/" + this.state.toDiscussion + '/'} />
        }
        const {classes} = this.props;
        return (
            <div className='app-wrapper'>
                <ContainerText title={this.state.type}/>
                <div className={classes.paper}>
                    <Paper elevation={3} >
                        <div className='flex-column justify-content-around col-12 d-flex flex-column p-5'>
                            <h3 className='mb-5'>
                                بحث ها
                            </h3>
                            <Grid container spacing={3}>
                                {(this.state.allDiscussions.data != undefined)?
                                    this.state.allDiscussions.data.map((discussion) => {
                                        return(
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Card className={classes.card}>
                                                    <CardMedia
                                                        className={classes.cardMedia}
                                                        image={discussion.photo}
                                                    />
                                                    <CardContent className={classes.cardContent}>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {discussion.title}
                                                        </Typography>
                                                        <Typography noWrap>
                                                            {discussion.text}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button size="small" color="primary" onClick={() => window.open(`${BaseUrlFront}discussion/${discussion.id}/`,"_self")}>
                                                            دیدن
                                                        </Button>
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
            </div>
        )
    }
}

export default (withStyles(useStyles)(Search))