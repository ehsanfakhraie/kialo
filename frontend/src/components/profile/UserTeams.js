import React from "react";
import axios from "axios";
import {BaseUrl} from "../../BaseUrl";
import {Card, CardBody, CardImg, CardSubtitle, CardText} from "reactstrap";
import Button from "@material-ui/core/Button";
import {NavLink} from "react-router-dom";


export default class UserTeams extends React.Component{
    constructor() {
        super();
        this.state={
            data:[]
        }
    }

    async componentDidMount() {
        let self = this;
        await axios({
            method: 'get',
            url:`${BaseUrl}/api/teams/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        }).then(async function (result) {
            console.log(result)
            await self.setState({data: result.data})
        }).catch(function (error) {

        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let self = this;
        if(prevProps.change !== this.props.change){
            await axios({
                method: 'get',
                url:`${BaseUrl}/api/teams/`,
                headers: {Authorization:'token '+localStorage.getItem('token')},
            }).then(async function (result) {
                console.log(result)
                await self.setState({data: result.data})
            }).catch(function (error) {

            })
        }
    }

    render() {
        return(
            <div className='flex-wrap w-100 d-flex'>
                {this.state.data.map((data, idx)=>{
                    return(
                        <Card className="shadow border-0">
                            <CardBody>
                                <h5 className="card-title">{data.teamId}</h5>
                                <CardSubtitle>سازنده:{data.owner.username}</CardSubtitle>
                                <NavLink to={`/editTeam/?id=${data.id}`}>
                                    <Button variant="contained" className="bg-primary text-white" onClick={null}>جزییات</Button>
                                </NavLink>
                            </CardBody>
                        </Card>
                    )
                })}
            </div>
        )
    }
}