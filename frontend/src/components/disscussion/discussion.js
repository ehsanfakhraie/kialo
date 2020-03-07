import React, { Component } from 'react';
import { connect } from 'react-redux';
import CChart from './chart';
import ClaimsList from './claimsList.';
import { Container, Row, Col, Card, CardBody, CardText, CardImg, CardTitle, Button } from "reactstrap";
import AddClaimDialog from "../../widget/AddClaimDialog";
import {BaseUrl} from "../../BaseUrl";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class Discussion extends Component {
    constructor(data) {
        super();
        this.state = {
            loading:true,
            id: 0, discussion: {
                claims: [],
                open:false
            }
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params
        console.log('di',id)
        fetch(`${BaseUrl}/api/discussions/` + id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    discussion: data,
                })
                console.log('di',this.state.discussion)
                this.setState({
                    ...this.state,loading:false
                })
            })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.dialog.type !==undefined && prevProps.dialog.type !== this.props.dialog.type && this.props.dialog.type === -1){
            const { id } = this.props.match.params
            console.log('di',id)
            await fetch(`${BaseUrl}/api/discussions/` + id)
                .then(response => response.json())
                .then(async data => {
                    await this.setState({
                        discussion: data,
                    })
                    console.log('di',this.state.discussion)
                    this.setState({
                        ...this.state,loading:false
                    })
                })
        }
        if(prevProps.dialog.error !== this.props.dialog.error && this.props.dialog.error != null){
            this.setState({success: this.props.dialog.error, open:true})
        }
    }

    renderCard(d) {
        return (<Col xs='12' key={d.id}>
            <Card >
                <CardImg top width="100%" src={d.photo} alt="Card image cap" />
                <CardBody>
                    <h2>
                        Title: {this.state.discussion.title}
                    </h2>
                    <h3>
                        Created By: {this.state.discussion.owner.username}
                    </h3>
                    <h3>
                        Description: {this.state.discussion.text}
                    </h3>
                </CardBody>
            </Card>
        </Col>)
    }

    render() {

        if(!this.state.loading)
            return (
                <div>
                    <div>
                        <Container>
                            {this.renderCard(this.state.discussion)}
                        </Container>
                    </div>
                    <br/>
                    <CChart discussion={this.state.discussion}/>
                    <ClaimsList discussion={this.state.discussion}/>
                    <AddClaimDialog discussion={this.state.discussion}/>
                    <Snackbar open={this.state.open} autoHideDuration={3000} onClose={() => this.setState({open: false})}>
                        <Alert onClose={() => this.setState({successopen: false})} severity="warning">
                            {this.state.success}
                        </Alert>
                    </Snackbar>
                </div>
            );
        else return(
            <div>
                loading..
            </div>
        )
    }
}
const mapStateToProps = ({dialog}) => {
    console.log('dialog::111', dialog)
    return {dialog}
};
export default connect(
    mapStateToProps,
    {}
)(Discussion);