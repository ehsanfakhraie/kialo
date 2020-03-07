import React from "react";
import Dialog from "@material-ui/core/Dialog";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ClearIcon from '@material-ui/icons/Clear';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from "react-redux";
import {suggestedListrDialog} from "../actions/diaog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
import {BaseUrl} from "../BaseUrl";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SuggestedList extends React.Component{
    constructor() {
        super();
        this.state={
            data:[{name:'ali', text:'ss ajsdhnlj sadhi ', type:1}],
            success:'',
            successopen:false,
            error:'',
            erroropen:false
        }
    }

    async handleSave(idx, data, i){
        var self = this
        await axios({
            method: 'put',
            url:`${BaseUrl}/api/updateClaim/${data.id}/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: {accepted:i}
        }).then(async function (response) {
            if(response.data.id != undefined && response.status === 200){
                console.log('done!')
                var remove= self.state.data;
                remove.splice(idx, 1);
                console.log(self.state.data[1])
                await self.setState({data: remove, success:(i===0)?'removed':'added', successopen:true})
                console.log('here!!!')
            }
            else{
                await self.setState({error: response.data.toString(), erroropen: true})
                console(response)
            }
        }).catch(async function (error) {
            console.log(error)
            await self.setState({error: error.toString(), erroropen: true})
        });

    }

    async suggestFinder(){
        console.log(this.props.claims);
        var a = await axios({
            method: 'get',
            url:`${BaseUrl}/api/claims/?discussion=${this.props.claims}`,
        });
        console.log(a)
        var array=[]
        for (let i in a.data){
                let n= {text: a.data[i]['text'], name:a.data[i]['owner']['username'], type: a.data[i].type, id: a.data[i].id}
                array= array.concat(n)
                console.log(n)
        }
        await this.setState({data: array})
        console.log(this.state.data)
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.dialog.suggestDialog !== this.props.dialog.suggestDialog && this.props.dialog.suggestDialog === true){
            this.suggestFinder()
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.dialog.suggestDialog}
                onClose={() => this.props.suggestedListrDialog()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullScreen
                TransitionComponent={Transition}

            >
                <AppBar id="alert-dialog-title" style={{backgroundColor:'#343a40'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => this.props.suggestedListrDialog()} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography>
                        suggested
                    </Typography>
                </Toolbar>
                </AppBar>
                <div style={{width:'100%', height:'100%'}}>
                <div style={{height:100}}/>
                    <div style={{height:'100%', overflow:"auto", padding:20}}>
                        {this.state.data.map((data, idx)=>{
                            return(
                                <ExpansionPanel style={{marginBottom:3, backgroundColor:(data.type == 0)?"#b3bbb7":(data.type == 1 )? "#73dba2" :  "#d85c5c"}}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>{data.name}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                        <Typography >
                                            {data.text}
                                        </Typography>
                                        <div >
                                        <IconButton  onClick={()=>this.handleSave(idx, data, 1)}>
                                            <CheckIcon/>
                                        </IconButton >
                                        <IconButton  onClick={()=>this.handleSave(idx, data, 0)}>
                                            <ClearIcon/>
                                        </IconButton >
                                        </div>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )
                        })}
                    </div>
                </div>
                <Snackbar open={this.state.successopen} autoHideDuration={3000} onClose={() => this.setState({successopen: false})}>
                    <Alert onClose={() => this.setState({successopen: false})} severity="success">
                        {this.state.success} successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.erroropen} autoHideDuration={3000} onClose={() => this.setState({erroropen: false})}>
                    <Alert onClose={() => this.setState({erroropen: false})} severity="error">
                        {this.state.error}
                    </Alert>
                </Snackbar>
            </Dialog>
        )
    }

}

const mapStateToProps = ({dialog}) => {
    console.log('dialog::', dialog)
    return {dialog}
};
export default connect(
    mapStateToProps,
    {suggestedListrDialog}
)(SuggestedList);