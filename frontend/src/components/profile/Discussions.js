import React from 'react';
import axios from "axios";
import {Redirect} from "react-router-dom";
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {BaseUrl, BaseUrlFront} from "../../BaseUrl";
import {connect} from "react-redux";
import {suggestedListrDialog} from "../../actions/diaog";
import SuggestedList from "../../widget/SuggestedList";
import LockIcon from '@material-ui/icons/Lock';

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

const cards = [1, 2, 3, 4];
const cards2 = [1, 2];
// const classes = useStyles();
// const [value, setValue] = React.useState(0);

class SimpleTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            myDiscussions:{},
            allDiscussions: {},
            toDiscussion:null,
            value:0,
            toEditDiscussion: -1
        }
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    async componentDidMount() {
        var a = await axios({
            method: 'get',
            url:`${BaseUrl}/api/userDiscussions/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        });
        console.log('MYDISCUSIION::',a)
        await this.setState({myDiscussions: a})
    }

    async handleSuggehstClick(id){
        await this.setState({selected: id})
        this.props.suggestedListrDialog()
    }

    render(){
        if (this.state.toDiscussion !== null) {
            return <Redirect to={"discussion/" + this.state.toDiscussion + '/'} />
        }else if(this.state.toEditDiscussion !== -1){
            return <Redirect to={"edit-discussion/" + this.state.toEditDiscussion + '/'} />
        }
        const {value} = this.state;
        const {classes} = this.props;
        return (
            <div>
                <AppBar position="static">
                    <Tabs 
                    value={value}
                    onChange={this.handleChange} 
                    aria-label="simple tabs example">
                        <Tab label="سازنده" {...a11yProps(0)} />
                        <Tab label="مدیر" {...a11yProps(1)} />
                        <Tab label="ادیتور" {...a11yProps(2)} />
                        <Tab label="نویسنده" {...a11yProps(3)} />
                        <Tab label="بیننده" {...a11yProps(4)}/>
                        <Tab label="نشان شده" {...a11yProps(5)}/>
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <Grid container spacing={4}>
                        {(this.state.myDiscussions.data != undefined)?
                            this.state.myDiscussions.data[0].owner.map((discussion) => {
                                return(
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={BaseUrl+discussion.photo}
                                                title="Image title"
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography noWrap className='text-right' gutterBottom variant="h5" component="h2">
                                                    {discussion.title}{discussion.private &&
                                                    <LockIcon/>
                                                    }
                                                </Typography>
                                                <Typography noWrap className='text-right'>
                                                    {discussion.text}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary" onClick={() => window.open(`${BaseUrlFront}discussion/${discussion.id}/`,"_self")}>
                                                    دیدن
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => window.open(`${BaseUrlFront}edit-discussion/${discussion.id}/`,"_self")}>
                                                    تدوین
                                                </Button>
                                                <Button size="small" color="primary" onClick={() =>  this.handleSuggehstClick(discussion.id)}>
                                                    ادعاها
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            }):null
                        }
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Grid container spacing={4}>
                        {(this.state.myDiscussions.data != undefined)?
                            this.state.myDiscussions.data[0].manager.map((discussion) => {
                                return(
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={BaseUrl+discussion.photo}
                                                title="Image title"
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography noWrap className='text-right' gutterBottom variant="h5" component="h2">
                                                    {discussion.title}
                                                </Typography>
                                                <Typography noWrap className='text-right'>
                                                    {discussion.text}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary" onClick={() => window.open(`${BaseUrlFront}discussion/${discussion.id}/`,"_self")}>
                                                    دیدن
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => window.open(`${BaseUrlFront}edit-discussion/${discussion.id}/`,"_self")}>
                                                    تدوین
                                                </Button>
                                                <Button size="small" color="primary" onClick={() =>  this.handleSuggehstClick(discussion.id)}>
                                                    ادعاها
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            }):null
                        }
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Grid container spacing={4}>
                        {(this.state.myDiscussions.data != undefined)?
                                this.state.myDiscussions.data[0].editor.map((discussion) => {
                                    return(
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card className={classes.card}>
                                                <CardMedia
                                                    className={classes.cardMedia}
                                                    image={BaseUrl+discussion.photo}
                                                    title="Image title"
                                                />
                                                <CardContent className={classes.cardContent}>
                                                    <Typography noWrap className='text-right' gutterBottom variant="h5" component="h2">
                                                        {discussion.title}
                                                    </Typography>
                                                    <Typography noWrap className='text-right'>
                                                        {discussion.text}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small" color="primary" onClick={() => window.open(`${BaseUrlFront}discussion/${discussion.id}/`,"_self")}>
                                                        دیدن
                                                    </Button>
                                                    {/*<Button size="small" color="primary" onClick={() => this.setState({...this.state,  toEditDiscussion: discussion.id})}>*/}
                                                    {/*    Edit*/}
                                                    {/*</Button>*/}
                                                    <Button size="small" color="primary" onClick={() =>  this.handleSuggehstClick(discussion.id)}>
                                                        ادعاها
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )
                            }):null
                        }
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Grid container spacing={4}>
                        {(this.state.myDiscussions.data != undefined)?
                                this.state.myDiscussions.data[0].writer.map((discussion) => {
                                    return(
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Card className={classes.card}>
                                                        <CardMedia
                                                            className={classes.cardMedia}
                                                            image={BaseUrl+discussion.photo}
                                                            title="Image title"
                                                        />
                                                        <CardContent className={classes.cardContent}>
                                                            <Typography noWrap className='text-right' gutterBottom variant="h5" component="h2">
                                                                {discussion.title}
                                                            </Typography>
                                                            <Typography noWrap className='text-right'>
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
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <Grid container spacing={4}>
                        {(this.state.myDiscussions.data != undefined)?
                            this.state.myDiscussions.data[0].bookmarked.map((discussion) => {
                                return(
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={BaseUrl+discussion.photo}
                                                title="Image title"
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography noWrap className='text-right' gutterBottom variant="h5" component="h2">
                                                    {discussion.title}
                                                </Typography>
                                                <Typography noWrap className='text-right'>
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
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <Grid container spacing={4}>
                        {(this.state.myDiscussions.data != undefined)?
                            this.state.myDiscussions.data[0].member.map((discussion) => {
                                return(
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={BaseUrl+discussion.photo}
                                                title="Image title"
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography noWrap className='text-right' gutterBottom variant="h5" component="h2">
                                                    {discussion.title}
                                                </Typography>
                                                <Typography noWrap className='text-right'>
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
                </TabPanel>
                <SuggestedList claims={this.state.selected}/>
            </div>
        );
    }
}

SimpleTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({dialog, discussions}) => {
    return {dialog}
};

export default connect(
    mapStateToProps,
    {suggestedListrDialog}
)(withStyles(useStyles) (SimpleTabs));
