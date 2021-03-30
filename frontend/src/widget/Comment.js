import {Card} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Send";
import '../components/css/claimsList.css'
import React from "react";
import axios from "axios";
import {BaseUrl} from "../BaseUrl";


export default class Comment extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [{owner:{username:''}, text:''}, {owner:{username:''}, text:''}],
            comment:''
        };

    }

    async componentDidMount() {
        console.log(this.props.claimSelect)
        var a =await axios({
            method: 'get',
            url:`${BaseUrl}/api/comments/?claim=${this.props.claimSelect}`,
        });
        await this.setState({data: a.data});
    }

    async sendButton(){
        let formData = new FormData;
        formData.append('text', this.state.comment);
        formData.append('for_claim', this.props.claimSelect);
        var a =await axios({
            method: 'post',
            url:`${BaseUrl}/api/comments/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data:formData
        });
        console.log(a)
        if(a.status === 201) {
            var joined = this.state.data.concat(a.data);
            await this.setState({data: joined, comment: ''})
        }

    }

    render() {
        const self = this;
        return(
            <div className={'commentBox'}>
                <div style={{ overflowY:'auto', overflowX: 'hidden', width:'100%', flex:9, border:'1px solid gray', borderRadius:'10px 10px 0 0'}}>
                    {(this.state.data != [{}] ) ? this.state.data.map((data, idx)=>{
                        return(
                            <div className='comment'>
                                <div className={'sender'}>
                                                <span style={{fontSize:12, textAlign:'right'}}>
                                                    {(data.owner != undefined) ? data.owner.username : null}
                                                </span>
                                </div>
                                <Card className={'commentText'}>
                                                <span style={{textAlign:'right'}}>
                                                    {(data.text != undefined) ? data.text : null}
                                                </span>
                                </Card>
                                <div style={{width:'10%'}}>

                                </div>
                            </div>
                        )
                    }):null}
                </div>
                {localStorage.getItem('token') != undefined &&
                    <div className={'send'}>
                    <TextField id="standard-basic" value={this.state.comment} placeholder="comment" multiline={true}
                               style={{flex: 11}} onChange={(e) => self.setState({comment: e.target.value})}/>
                    <IconButton aria-label="delete" style={{flex: 1, margin: 2}} onClick={() => self.sendButton()}>
                        <DeleteIcon fontSize="large" style={{transform: 'scaleX(-1)'}}/>
                    </IconButton>
                </div>
                }
            </div>
        )
    }
}