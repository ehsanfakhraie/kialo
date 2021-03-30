import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Container } from 'reactstrap';

import { login } from "../actions/auth";
import { returnErrors } from "../actions/messages";
import history from "../historyForRouter/history";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {withStyles, fade} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

const useStyles = theme => ({
    root: {
        flexGrow: 10,
        display: 'flex',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    button :{
        height: '100%',
        margin: theme.spacing(2),
    },
    title: {
        // flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '40%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        left:0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
    }
});

class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            search:''

        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool
    };


    render() {
        console.log(this.props.isAuthenticated)
        const handleMenu = (event) => {
            this.setState({anchorEl: event.currentTarget});
        };

        const handleClose = () => {
            this.setState({anchorEl: null});
        };

        const open = Boolean(this.state.anchorEl);
        const { classes } = this.props;
        // var p=[];
        // if(this.props.isAuthenticated){
        //     p.push(<Link to="/profile" className="nav-item nav-link active">Profile</Link>)
        //     p.push(<Link to="/add-discussion" className="nav-item nav-link active">New Discussion</Link>)
        //     p.push(<Link to="/logout" className="nav-item nav-link ">Log out</Link>)
        // }else{
        //     p.push(<Link to="/login" className="nav-item nav-link active">Login</Link>)
        // }
        return (
            <>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title} style={{display:'inline-block'}}>
                            کیالو
                        </Typography>
                        <Link to="/" style={{color:'white'}}>
                            <Button className={classes.button} color="inherit">
                                <Typography style={{display:'inline-block'}}>
                                    خانه
                                </Typography>
                            </Button>
                        </Link>
                        {!this.props.isAuthenticated &&
                            <Link to="/login" style={{color:'white'}}>
                            <Button className={classes.button} color="inherit">
                                <Typography style={{display:'inline-block'}}>
                                    ورود
                                </Typography>
                            </Button>
                        </Link>
                        }
                        <form className={classes.search} onSubmit={(e) => {
                            e.preventDefault();
                            history.push({
                                pathname: `/search`,
                                search: `?search=${this.state.search}`
                            });
                            window.location.reload(false)
                        }}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="جستجو..."
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                value={this.state.search}
                                onChange={event => this.setState({search: event.target.value})}

                            />
                            {/*<Button type="submit">Submit</Button>*/}
                        </form>
                        {this.props.isAuthenticated != 0 && (
                            <div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <Link to="/profile"><MenuItem onClick={handleClose}>پروفایل</MenuItem></Link>
                                    <Link to="/add-discussion"><MenuItem onClick={handleClose}>بحث جدید</MenuItem></Link>
                                    <Link to="/logout"><MenuItem onClick={handleClose}>خروج</MenuItem></Link>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            </>
        );

    }
}

Nav.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { login }
)(withStyles(useStyles) (Nav));
