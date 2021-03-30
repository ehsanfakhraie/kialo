import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@material-ui/core/IconButton';
import history from "../../historyForRouter/history";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Tooltip from "@material-ui/core/Tooltip"

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

class MyClaims extends React.Component{

    constructor() {
        super();
        this.state={
            claims:[],
            delete:false,
            selected:'',
            edit:false,
            text:'',
            claimText:''
        }
    }

    async componentDidMount() {
        console.log('claim', this.props.claims)
        let claims=[]
        for (let i = 0; i < this.props.claims.length ; i++) {
            if(this.props.claims[i].type == this.props.num){
                claims.push(this.props.claims[i])
            }
        }
        await this.setState({claims: claims})
        console.log(this.state.claims)
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.claims !== this.props.claims){
            let claims=[]
            for (let i = 0; i < this.props.claims.length ; i++) {
                if(this.props.claims[i].type == this.props.num){
                    claims.push(this.props.claims[i])
                }
            }
            await this.setState({claims: claims})
            console.log(this.state.claims)
        }
    }


    render() {
        const {classes} = this.props;
        return(
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.row}>
                            <CustomTableCell align="center">نوع</CustomTableCell>
                            <CustomTableCell align="center">در بحث</CustomTableCell>
                            <CustomTableCell align="center">ادعا</CustomTableCell>
                            <CustomTableCell align="center">لینک</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.claims.map((claim, idc) => {
                                return(
                                    <TableRow className={classes.row}>
                                        <CustomTableCell align="center">{(claim['suggested']==1)?<Tooltip title="ادعای شما هنوز برای نمایش تایید نشده است"><ErrorOutlineIcon style={{color:"orange"}}/></Tooltip>:null}  {this.props.model}</CustomTableCell>
                                        <CustomTableCell align="center">{claim['discussion_title']}</CustomTableCell>
                                        <CustomTableCell align="center">{claim.text}</CustomTableCell>
                                        <CustomTableCell style={{maxWidth: '5px'}} align="center">
                                            <IconButton aria-label="delete" onClick={()=>{
                                                history.push(`/discussion/${claim['for_discussion']}/?claim=${claim['id']}`);
                                                window.location.reload(false)
                                            }}>
                                                <LinkIcon />
                                            </IconButton>
                                        </CustomTableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

MyClaims.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (dialog) => {
    return {dialog}
};

export default connect(
    mapStateToProps,
    {}
)(withStyles(useStyles) (MyClaims))

