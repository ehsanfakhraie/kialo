import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {connect} from "react-redux";
import {addManagerDialog} from "../../actions/diaog";
import ListAltIcon from '@material-ui/icons/ListAlt';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {BaseUrl} from "../../BaseUrl";
import {InformationDiscussion} from "../../actions/discussion";
import {searchError} from "../../actions/messages";
import TextField from "@material-ui/core/TextField";
import queryString from "query-string";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = theme => ({
    root: {
        flexGrow: 1,
        maxWidth: '80%',
        marginRight: '10%',
        marginLeft: '10%',
    },
    demo: {
        backgroundColor: 'white',
    },
    title: {
        margin: (32,0,16),
        display:'inline-block'
    },
    member:{
        borderBottom:'1px solid gray'
    }
})

class editTeam extends React.Component{

    constructor() {
        super();
        this.state={
            members:[],
            selected:'',
            delete:false,
            username:'',
            addDialog:false,
            SearchText:'',
            mes:'',
            open:false
        }
    }

    async openDialog(title, name) {
        await this.setState({selected: name})
        await this.props.addManagerDialog(title)
    }

    async deleteButton(){
        var self = this;
        let formData = new FormData;
        formData.append('user', this.state.username)
        await axios({
            method: 'put',
            url:`${BaseUrl}/api/teams/${queryString.parse(this.props.location.search).id}/deleteMember`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formData
        }).then(function (response) {
            window.location.reload(false)
        }).catch(function (error) {
            self.setState({open:true, mes:'حذف نشد'})
        })
    }
    async handdleClick(){
        var self = this;
        let formData = new FormData;
        formData.append('user', this.state.SearchText)
        await axios({
            method: 'put',
            url:`${BaseUrl}/api/teams/${queryString.parse(this.props.location.search).id}/addMember`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formData
        }).then(function (response) {
            window.location.reload(false)
        }).catch(function (error) {
            self.setState({open:true, mes:'کاربر یافت نشد'})
        })
    }

    async componentDidMount() {
            let self = this;
            await axios({
                method: 'get',
                url:`${BaseUrl}/api/teams/`,
                headers: {Authorization:'token '+localStorage.getItem('token')},
            }).then(async function (result) {
                for (let i = 0; i <result.data.length ; i++) {
                    console.log(result)
                    if(result.data[i].id == queryString.parse(self.props.location.search).id){
                        self.setState({members:result.data[i].users})
                    }
                }
            }).catch(function (error) {

            })
    }

    render() {
        const {classes} = this.props;
        return(
            <div>
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <div className="d-flex flex-row ">
                                <Typography variant="h6" className={classes.title}>
                                    اعضا
                                </Typography>
                                <div className="align-self-center">
                                    <IconButton edge="end" aria-label="delete" onClick={()=>this.setState({addDialog:true})}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className={classes.demo}>
                                <List className="ml-md-5 mr-md-5">
                                    {(Array.isArray(this.state.members))?this.state.members.map((manager, idx)=>{
                                        return(
                                            <ListItem className={classes.member}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ListAltIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={manager.username}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>this.setState({
                                                        delete:true, username: manager.username})}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    }):null}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                    <Dialog style={{textAlign:"right"}}
                        open={this.state.delete}
                        onClose={()=>this.setState({delete: false})}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                آیا از حذف {this.state.username} از تیم {this.state.selected}مطمئنید؟
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>this.setState({delete: false})} color="primary">
                                نه
                            </Button>
                            <Button onClick={()=>this.deleteButton()} color="primary" autoFocus>
                                بله
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.addDialog}
                        onClose={() => this.setState({addDialog: false})}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth
                    >
                        <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                یوزر مورد نظر را بیابید
                            </DialogContentText>
                            <TextField id="standard-basic" label="search..." fullWidth multiline onChange={(e)=> this.setState({SearchText: e.target.value})}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({addDialog: false})} color="primary">
                                لغو
                            </Button>
                            <Button onClick={() => this.handdleClick()} color="primary" autoFocus>
                                تایید
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar open={this.state.open} autoHideDuration={3000} onClose={() => this.setState({open: false})}>
                        <Alert onClose={() => this.setState({open: false})} severity="error">
                            {this.state.mes}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        )
    }

}

editTeam.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = (dialog) => {
    return {dialog}
};

export default connect(
    mapStateToProps,
    {addManagerDialog, InformationDiscussion, searchError}
)(withStyles(useStyles) (editTeam))