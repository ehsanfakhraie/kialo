import React from "react";
import '../components/css/claimsList.css'
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import StarIcon from '@material-ui/icons/Star';
import axios from "axios";
import {number} from "prop-types";
import {NavLink} from "react-router-dom";
import Redirect from "react-router-dom/es/Redirect";
import {BaseUrl} from "../BaseUrl";

export default class Vote extends React.Component{
    constructor() {
        super();
        this.state={
            data:{0:0, 1:0, 2:0, 3:0, 4:0, 5:0, total:0},
            size:0,
            color:{ 1:'#cfcfcf', 2:'#9e9e9e', 3:'#6e6e6e', 4:'#3d3d3d', 5:'#1e1e1e'},
            numbers:[1,2,3,4,5],
            total:0,
            response:'',
            login:false
        }
    }

    async vote(rate){
        let formData = new FormData;
        formData.append('rate', rate);
        formData.append('for_claim', this.props.claims);
        var a =await axios({
            method: 'post',
            url:`${BaseUrl}/api/votes/`,
            headers:{Authorization: 'token '+ localStorage.getItem('token')},
            data:formData
        });
        this.setState({response: a})
        console.log(a, localStorage.getItem('token'))
    }

    async start(){
        var a =await axios({
            method: 'get',
            url:`${BaseUrl}/api/claims/?`,
        });
        // console.log(b);
        for(let i in a.data){
            console.log(a.data[i])
            if(a.data[i].id === this.props.claims){
                var m=0;
                console.log(i)
                for(let n in a.data[i].votes){
                    m= m+a.data[i].votes[n];
                }
                await this.setState({data: a.data[i].votes, total: m})
                console.log(this.state.total)
                break
            }
        }
        await this.setState({size: 50*(this.state.total-Math.max(this.state.data[1], this.state.data[2], this.state.data[3], this.state.data[4], this.state.data[5]))/this.state.total})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.response !== ''){
            this.start();
            this.setState({response:''})
        }
    }

    async componentDidMount() {
        this.start();
        if(this.props.type === "1"){
            await this.setState({color:{1:'#afe8d0', 2:'#8edfbc', 3:'#71d7ab', 4:'#48cb92', 5:'#248b5e'}})
        }else if(this.props.type === "2"){
            await this.setState({color:{1:'#fec3bb', 2:'#fdafa4', 3:'#fd8f81', 4:'#fd7361', 5:'#f8543e'}})
        }
    }

    render() {
        if (this.state.login === true) {
            return <Redirect to='/login' />
        }
        return(
            <div className={'VoteBox'}>
                {this.state.numbers.map((numbers, idx)=>{
                    return(
                        <div className={'VoteList'}>
                            <div className={'SubVote'}>
                                <span>
                                    {this.state.data[numbers]}<AccessibilityIcon/>
                                </span>
                            </div>
                            <div className={'Vote'} style={{height: (this.state.data[numbers] !==0)
                                    ?(150*this.state.data[numbers]/this.state.total)+this.state.size
                                    :0, backgroundColor: this.state.color[numbers]}}>
                            </div>
                            <div className={'SubVote'} style={{backgroundColor: this.state.color[numbers], cursor: 'pointer'}} onClick={() =>(localStorage.getItem('token') != undefined)?this.vote(numbers): this.setState({login: true})}>
                                <StarIcon style={{color:"gold"}}/>
                                <div className={'numbers'}>
                                    <span className={'numbers'} >
                                        {numbers}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

}