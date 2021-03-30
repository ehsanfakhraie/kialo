import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { ReactReduxContext } from 'react-redux'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login ,logout} from "../actions/auth";
import { returnErrors } from "../actions/messages";
import { Container, Row } from "reactstrap";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class Login extends Component {
    state = {
        username: "",
        password: "",
        erroropen: false,
    };

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        logout:PropTypes.func.isRequired
    };


    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
    };

    handleChange = event => {
        event.persist();
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.error !== prevProps.error){
            this.setState({erroropen: true})
        }
    }


    render() {
        console.log("1")
        if (this.props.isAuthenticated) {
            console.log("2")
            return <Redirect to="/" />;
        }
        // if(this.state.errors.status){
        //   error=this.props.errors.msg;
        // }
        const { username, password } = this.state;
        return (
            <Container>
                <Row>
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="card card-body mt-5">
                            <h2 className="text-center">ورود</h2>
                            <ValidatorForm onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <TextValidator
                                        className="mt-4 mb-16 w-100"
                                        label="نام کاربری"
                                        variant='outlined'
                                        onChange={this.handleChange}
                                        type="text"
                                        name="username"
                                        value={username}
                                        validators={["required"]}
                                        errorMessages={["این فیلد اجباریست"]}
                                    />
                                </div>

                                <div className="form-group">
                                    <TextValidator
                                        className="mb-16 w-100"
                                        label="رمز عبور "
                                        variant='outlined'
                                        onChange={this.handleChange}
                                        name="password"
                                        type="password"
                                        value={password}
                                        validators={["required"]}
                                        errorMessages={["این فیلد اجباریست"]}
                                    />
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        ورود
                                    </button>
                                </div>
                                {/* <p>
                                    Don't have an account? <Link to="/register">Register</Link>
                                </p> */}
                            </ValidatorForm>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                    <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false})}>
                        <Alert onClose={() => this.setState({erroropen: false})} severity="error">
                            یوزر نیم یا پسورد صحیح نمیباشد
                        </Alert>
                    </Snackbar>
                </Row>
            </Container>

        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error:JSON.stringify(state.errors.msg)
});

export default connect(
    mapStateToProps,
    { logout,login ,returnErrors}
)(Login);
