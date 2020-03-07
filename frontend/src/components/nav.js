import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Container } from 'reactstrap';

import { login } from "../actions/auth";
import { returnErrors } from "../actions/messages";

import PropTypes from "prop-types";

import { connect } from "react-redux";


class Nav extends React.Component {

    static propTypes = {
        isAuthenticated: PropTypes.bool
    };


    render() {
        var p=[];
        if(this.props.isAuthenticated){
            p.push(<Link to="/profile" className="nav-item nav-link active">Profile</Link>)
            p.push(<Link to="/mydiscussion" className="nav-item nav-link active">My Discussion</Link>)
            p.push(<Link to="/add-discussion" className="nav-item nav-link active">New Discussion</Link>)
            p.push(<Link to="/logout" className="nav-item nav-link ">Log out</Link>)
        }else{
            p.push(<Link to="/login" className="nav-item nav-link active">Login</Link>)
        }
        return (
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <Container>
                    <a class="navbar-brand" href="#">Kialo</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <Link to="/" className="nav-item nav-link active">Home</Link>
                            {p}
                        </div>
                    </div>
                </Container>

            </nav>
        );

    }
}

//export default Nav;

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { login }
)(Nav);
