import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {addManagerDialog} from "../../actions/diaog";
import {withStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import {BaseUrl} from "../../BaseUrl";
import TextField from "@material-ui/core/TextField";
import {InformationDiscussion} from "../../actions/discussion";
import {searchError} from "../../actions/messages";
import {TextValidator} from "react-material-ui-form-validator";

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);

const useStyles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        marginBottom: '20px'
    },
        table: {
        minWidth: 700,
    },
        row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    smallCell:{
        maxWidth: "10px"
    }
});

class Claims extends React.Component{

    constructor() {
        super();
        this.state={
            claims:[],
            delete:false,
            selected:'',
            edit:false,
            text:'',
            claimText:'',
            link:''
        }
    }

    async componentDidMount() {
        await this.setState({
            claims:this.props.claims
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.claims !== this.props.claims){
            this.setState({
                claims:this.props.claims
            })
        }
    }

    async deleteButton(){
        var self = this;
        await axios({
            method: 'delete',
            url:`${BaseUrl}/api/claims/delete/${this.state.selected}/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        }).then(function (response) {
            self.setState({delete: false})
            let data= {type: 'claim'};
            self.props.InformationDiscussion(data, response)
        }).catch(function (error) {
            self.props.searchError("didn't edit")
        })
    }

    async handdleEdit(){
        var self = this;
        let formData = new FormData;
        formData.append('text', this.state.claimText);
        formData.append('link', this.state.link);
        await axios({
            method: 'put',
            url:`${BaseUrl}/api/claims/update/${this.state.selected}/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formData
        }).then(async function (response) {
            await self.setState({edit: false})
            let data= {type: 'claim'};
            self.props.InformationDiscussion(data, response)
        }).catch(function (error) {
            self.props.searchError("didn't edit")
        })
    }

    render() {
        const {classes} = this.props;
        return(
            <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.row}>
                    <CustomTableCell align="center">نوع</CustomTableCell>
                    <CustomTableCell align="center">متن</CustomTableCell>
                    <CustomTableCell style={{maxWidth: '5px'}} align="center">اطلاح</CustomTableCell>
                    <CustomTableCell style={{maxWidth: '5px'}} align="center">حذف</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.claims.map((claim, idc) => {
                      if(idc!=0)
                    return(
                      <TableRow className={classes.row}>
                            {(claim.type == '0') && <CustomTableCell align="center">خنثی</CustomTableCell>}
                            {(claim.type == '2') && <CustomTableCell align="center">مثبت</CustomTableCell>}
                            {(claim.type == '1') && <CustomTableCell align="center">منفی</CustomTableCell>}
                            <CustomTableCell align="center">{claim.text}</CustomTableCell>
                        <CustomTableCell style={{maxWidth: '5px'}} align="center">
                            <IconButton aria-label="edit" onClick={()=>this.setState({edit:true, selected:claim.id, claimText:claim.text, link: claim.link})}>
                              <EditIcon />
                            </IconButton>
                        </CustomTableCell>
                        <CustomTableCell style={{maxWidth: '5px'}} align="center">
                            <IconButton aria-label="delete" onClick={()=>this.setState({delete:true, selected:claim.id})}>
                                <DeleteIcon />
                            </IconButton>
                        </CustomTableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
                <Dialog
                    open={this.state.delete}
                    onClose={()=>this.setState({delete: false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure that you want to delete this claim?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>this.setState({delete: false})} color="primary">
                            NO
                        </Button>
                        <Button onClick={()=>this.deleteButton()} color="primary" autoFocus>
                            YES
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.edit}
                    onClose={() => this.setState({edit: false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">{"Change Claim's Text"}</DialogTitle>
                    <DialogContent>
                        <TextField id="standard-basic" value={this.state.claimText} label="Standard" fullWidth multiline onChange={(e)=> this.setState({claimText: e.target.value})}/>
                        <TextField type="url" name="Link" value={this.state.link} dir="ltr"
                                       className="mt-3"  id="standard-basic" placeholder="https://www.google.com/"
                                       fullWidth multiline onChange={(e)=> this.setState({link: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({edit:false})} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.handdleEdit()} color="primary" autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
          </Paper>
        )
    }
}

Claims.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (dialog) => {
    return {dialog}
};

export default connect(
    mapStateToProps,
    {addManagerDialog, InformationDiscussion, searchError}
)(withStyles(useStyles) (Claims))

