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
import SearchDialog from '../disscussion/searchUserDialog'
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {connect} from "react-redux";
import {addManagerDialog} from "../../actions/diaog";
import ListAltIcon from '@material-ui/icons/ListAlt';
import LineStyleIcon from '@material-ui/icons/LineStyle';
import TextFieldsIcon from '@material-ui/icons/TextFields';
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

class Members extends React.Component{

    constructor() {
        super();
        this.state={
            managers:[],
            writers:[],
            editors:[],
            members:[],
            selected:'',
            delete:false,
            username:''
        }
    }

    async openDialog(title, name) {
        await this.setState({selected: name})
        await this.props.addManagerDialog(title)
    }

    async deleteButton(){
        var self = this;
        let formData = new FormData;
        formData.append(this.state.selected, this.state.username)
        await axios({
            method: 'put',
            url:`${BaseUrl}/api/discussions/update/deleteMember/${this.props.id}/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formData
        }).then(function (response) {
            let data={type: 'member', member:self.state.selected, data: self.state.username, add:2};
            self.props.InformationDiscussion(data, response)
            self.setState({delete: false})
        }).catch(function (error) {
            self.props.searchError('فرد پیدا نشد')
        })
    }

    async componentDidMount() {
        await this.setState({
            managers:this.props.managers,
            writers:this.props.writers,
            editors:this.props.editors,
            members: this.props.members
        });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.managers !== this.props.managers || prevProps.editors !== this.props.editors || prevProps.writers !== this.props.writers){
            this.setState({
                managers:prevProps.managers,
                writers:prevProps.writers,
                editors:prevProps.editors,
                members: prevProps.members
            })
        }
        if(this.props.addone!=null && prevProps.addone != this.props.addone){
            let newusers= this.state[this.props.addone.type];
            newusers.push(this.props.addone);
            this.setState({[this.props.addone.type]: newusers})
        }else if(this.props.removeOne!=null && prevProps.removeOne != this.props.removeOne){
            let newusers= this.state[this.props.removeOne.type];
            newusers.splice(this.props.removeOne.index, 1);
            this.setState({[this.props.removeOne.type]: newusers})
        }
    }

    render() {
        const {classes} = this.props;
        return(
            <div>
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <div className="d-flex flex-row ">
                                <Typography variant="h6" className={classes.title}>
                                    مدیرها
                                </Typography>
                                <div className="align-self-center">
                                    <IconButton edge="end" aria-label="delete" onClick={()=>this.openDialog('اضافه کردن مدیر جدید', 'manager')}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className={classes.demo}>
                                <List className="ml-md-5 mr-md-5">
                                    {(Array.isArray(this.state.managers))?this.state.managers.map((manager, idx)=>{
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
                                                        delete:true, selected: 'manager', username: manager.username})}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    }):null}
                                </List>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="d-flex flex-row ">
                                <Typography variant="h6" className={classes.title}>
                                    تدوینگر ها
                                </Typography>
                                <div className="align-self-center">
                                    <IconButton edge="end" aria-label="delete" onClick={()=>this.openDialog('اضافه کردن ادیتور جدید', 'editor')}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className={classes.demo}>
                                <List className="ml-md-5 mr-md-5">
                                    {this.state.editors.map((editor, idx)=>{
                                        return(
                                            <ListItem className={classes.member}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LineStyleIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={editor.username}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>this.setState({
                                                        delete:true, selected: 'editor', username: editor.username})}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <div className="d-flex flex-row ">
                                <Typography variant="h6" className={classes.title}>
                                    نویسنده‌ها
                                </Typography>
                                <div className="align-self-center">
                                    <IconButton edge="end" aria-label="delete" onClick={()=>this.openDialog('اضافه کردن نویسنده جدید', 'writer')}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className={classes.demo}>
                                <List className="ml-md-5 mr-md-5">
                                    {this.state.writers.map((writer, idx)=>{
                                        return(
                                            <ListItem className={classes.member}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <TextFieldsIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={writer.username}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>this.setState({
                                                        delete:true, selected: 'writer', username: writer.username})}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </div>
                        </Grid>
                        {this.props.private &&
                        <Grid item xs={12} md={6}>
                            <div className="d-flex flex-row ">
                                <Typography variant="h6" className={classes.title}>
                                    اعضا
                                </Typography>
                                <div className="align-self-center">
                                    <IconButton edge="end" aria-label="delete"
                                                onClick={() => this.openDialog('اضافه کردن عضو جدید', 'member')}>
                                        <AddIcon/>
                                    </IconButton>
                                </div>
                            </div>
                            <div className={classes.demo}>
                                <List className="ml-md-5 mr-md-5">
                                    {this.state.members.map((writer, idx) => {
                                        return (
                                            <ListItem className={classes.member}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <TextFieldsIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={writer.username}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete"
                                                                onClick={() => this.setState({
                                                                    delete: true,
                                                                    selected: 'writer',
                                                                    username: writer.username
                                                                })}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </div>
                        </Grid>
                        }
                    </Grid>
                    <SearchDialog
                        open = {this.props.dialog.dialog.openDialog}
                        title = {this.props.dialog.dialog.title}
                        id={this.props.id}
                        name={this.state.selected}
                    />
                    <Dialog style={{textAlign:"right"}}
                        open={this.state.delete}
                        onClose={()=>this.setState({delete: false})}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"حذف کاربر"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                آیا میخواهید کاربر {this.state.username}  از بحث {this.state.selected} مطمئنید؟
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>this.setState({delete: false})} color="primary">
                                نه
                            </Button>
                            <Button onClick={()=>this.deleteButton()} color="primary" autoFocus>
                                آره
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }

}

Members.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = (dialog) => {
    return {dialog}
};

export default connect(
    mapStateToProps,
    {addManagerDialog, InformationDiscussion, searchError}
)(withStyles(useStyles) (Members))