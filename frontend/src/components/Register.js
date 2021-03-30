import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../actions/auth";
import { createMessage } from "../actions/messages";
import { Container } from "reactstrap";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class Register extends Component {
    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }
    state = {
        username: "",
        email: "",
        password: "",
        password2: "",
        erroropen:false,
        errormessage:''
    };

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    onSubmit = e => {
        e.preventDefault();
        const { username, email, password, password2 } = this.state;
        const newUser = {
            username,
            password,
            email
        };
         this.props.register(newUser);
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.err !== prevProps.err){
            if(JSON.parse(this.props.error).username){
                this.setState({erroropen: true, errormessage:'این نام کاربری تکراریست'})
            }else if(JSON.parse(this.props.error).password){
                this.setState({erroropen: true, errormessage:'رمز بیش از حد ساده میباشد'})
            }else if(JSON.parse(this.props.error).email){
                this.setState({erroropen: true, errormessage:'این ایمیل تکراریست'})
            }else{
                this.setState({erroropen: true, errormessage:'مشکلی رخ داده است'})
            }
        }
    }

    handleChange = event => {
        event.persist();
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        console.log(JSON.parse(this.props.error));
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }
        const { username, email, password, password2 } = this.state;
        return (
            <Container>
                <div className="col-md-3"></div>
                <div className="col-md-6 m-auto">
                    <div className="card card-body mt-5">
                        <h2 className="text-center">Register</h2>
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
                                    label="ایمیل"
                                    variant='outlined'
                                    onChange={this.handleChange}
                                    type="text"
                                    name="email"
                                    value={email}
                                    validators={["required", 'isEmail']}
                                    errorMessages={["این فیلد اجباریست", 'ایمیل صحیح نمیاشد']}
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
                                <TextValidator
                                    className="mb-16 w-100"
                                    label="تکرار رمز عبور "
                                    variant='outlined'
                                    onChange={this.handleChange}
                                    name="password2"
                                    type="password"
                                    value={password2}
                                    validators={["required", "isPasswordMatch"]}
                                    errorMessages={["این فیلد اجباریست", "رمزها یکسان نیستند"]}
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                            <p>
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
                        </ValidatorForm>
                    </div>
                </div>
                <div className="col-md-3"></div>
                <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false})}>
                    <Alert onClose={() => this.setState({erroropen: false})} severity="error">
                        {this.state.errormessage}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error:JSON.stringify(state.errors.msg),
    err: state.errors
});

export default connect(
    mapStateToProps,
    { register, createMessage }
)(Register);