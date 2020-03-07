import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { ReactReduxContext } from 'react-redux'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login ,logout} from "../actions/auth";
import { returnErrors } from "../actions/messages";
import { Container, Row } from "reactstrap";
import store from '../store';

export class Logout extends Component {
    state = {
        username: "",
        password: ""
    };

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        logout:PropTypes.func.isRequired
    };


    componentDidMount(){
        this.props.logout();
    }
    render() {
        return <Redirect to="/" />;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error:JSON.stringify(state.errors.msg)
});

export default connect(
    mapStateToProps,
    { logout,login ,returnErrors}
)(Logout);
