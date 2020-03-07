import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { ReactReduxContext } from 'react-redux'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login ,logout} from "../actions/auth";
import { returnErrors } from "../actions/messages";
import { Container, Row } from "reactstrap";
import store from '../store';

export class Login extends Component {
    state = {
        username: "",
        password: ""
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

    onChange = e => this.setState({ [e.target.name]: e.target.value });



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
                            <h2 className="text-center">Login</h2>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        onChange={this.onChange}
                                        value={username}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        onChange={this.onChange}
                                        value={password}
                                    />
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                    </button>
                                </div>
                                <p>
                                    Don't have an account? <Link to="/register">Register</Link>
                                </p>

                                <p style={{color:"red"}}>{this.props.error}</p>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
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
