import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import {BaseUrl} from "../BaseUrl";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Button } from "reactstrap";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
        cursor: 'pointer'
    },
    customWidth: {
        maxWidth: 500
    },
    noMaxWidth: {
        maxWidth: "none"
    }
});

class Flag extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            comment:'',
            open:false,
            color:'success',
            text:'',
            selected:null,
        };
    }

    matcher(id){
        switch (id) {
            case 1:
                return {title:'پشتیبانی نشده', message:'این ادعا فاقد شواهد و منابع مرتبط یا تبیینی در زیر آن است.'}
            case 2:
                return {title:'ادعایی نشده است', message:'یک ادعا باید بخشی از ساختار فرضیات و نتایج یک بحث ر ا' + ' تشکیل دهد. هر چیزي که این کار را انجام نمی دهد، به بحث نکته اي اضافه نمی کند و' + ' یک ادعا نیست'}
            case 3:
                return {title: 'مبهم', message: 'این علامت باید براي نشان دادن این موضوع مورد استفاده قرار گیرد که کاربري که این ادعا را علامت گذاري می کند، معناي این ادعا، یا برخی از جنبه هاي آن را درك نمی کند'}
            case 4:
                return {title: 'گستاخی / توهین', message: ' این ادعا حمله به دیگري است، بیش از حد توهین آمیز است، و یا به طور غیر ضروري عامیانه است.'}
            case 5:
                return {title: 'ادعا تکراري', message: 'این ادعا یک ادعاي موجود دیگر در بحث، چه به صورت ناقص و چه به طور کامل تکرار می کند. این مورد اغلب زمانی اتفاق می افتد که یک ادعا دوبار ایجاد می شود، ویا زمانی اتفاق بیفتد که یک ادعا با استفاده از عبارت هاي مختلف چیزي به بحث اضافه نکند.'}
            case 6:
                return {title: 'ادعاي نامربوط', message: 'این ادعا هیچ ارتباطی منطقی با ادعاي بالاسر خود ندارد، یا از آن حمایت نکرده یا به آن حمله نمی کند، و بنابراین به طور بالقوه در موقعیت فعلی اش بی ربط است.'}
            case 7:
                return {title: 'بیش از یک ادعا', message: 'این ادعا هیچ ارتباطی منطقی با ادعاي بالاسر خود ندارد، یا از آن حمایت نکرده یا به آن حمله نمی کند، و بنابراین به طور بالقوه در موقعیت فعلی اش بی ربط است.'}
            case 8:
                return {title: 'انتقال به جاي دیگر', message: 'این ادعا حاوي مطالبی است که احتمالا باید به چندین ادعا تقسیم شود.'}
        }
    }

    async componentDidMount() {
        var a =await axios({
            method: 'get',
            url:`${BaseUrl}/api/flags/?claim=${this.props.claimSelect}`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
        });
        await this.setState({data: a.data});
    }

    select(number){
        this.setState({
            ...this.state,
            selected:number
        })
    }

    async send(){
        
        var number=this.state.selected
        var self = this;
        let formData = new FormData;
        formData.append('type', number)
        formData.append('for_claim', this.props.claimSelect);
        await axios({
            method: 'post',
            url:`${BaseUrl}/api/flags/`,
            headers: {Authorization:'token '+localStorage.getItem('token')},
            data: formData
        }).then(function (response) {
            let data = self.state.data;
            self.setState({open: true, color: 'success', text: 'با موفقیت ثبت شد.', data: response.data})
             
        }).catch(function (error) {
            console.log(error.response);
            if(error.response.data.detail==="Duplicate"){
                self.setState({open: true, color: 'success', text: 'با موفقیت ثبت شد.', data: error.response.data.flags})
                self.setState({open:true, color: 'error', text:"شما قبلا در این ادعا برچسب زده‌اید، برچسب شما تغییر کرد"})
            }
            else{
                self.setState({open:true, color: 'error', text:"مشکلی رخ داد!"})

            }
        })
       

    }

    render() {
        const {classes} = this.props
        const self = this;
        return(
            <div className={'flagBox'}>
                <Grid container className='w-100 h-100'>
                    <Grid item xs={6} className='h-75 text-right'>
                    <label >
                        برچسب های کاربران بر این ادعا
                    </label>
                        <div className='w-60 h-100 m-3 p-2 rounded-lg border border-secondary overflow-auto'>
                            {this.state.data.map((data, idx)=>{
                                self.matcher(data.type)
                                var show = self.matcher(data.type);
                                return(
                                    <div className='d-flex flex-row justify-content-start m-1 border-bottom p-1'>
                                        <span>
                                            برچسب کاربر {data.owner.username}
                                        </span>
                                        <Tooltip title={(show !== undefined)?show.message:null} className='m-1'>
                                            <Chip color="secondary" label={(show !== undefined)?show.title:null} />
                                        </Tooltip>
                                    </div>
                                )
                            })}
                        </div>
                    </Grid>
                    
                    <Grid item xs={5} className='align-items-start h-75 pr-5' style={{textAlign:"right"}}>
                    <label>
                        اضافه کردن برچسب جدید
                    </label>
                    <br></br>
                    <small>
                       برای مشاهده توضیحات هر برچسب روی آن نگه دارید
                    </small>
                    <br></br>

                    <Tooltip title="این ادعا فاقد شواهد و منابع مرتبط یا تبیینی در زیر آن است.">
                        <Chip
                            className={classes.button}
                            color={this.state.selected===1?"primary":"secondary"}
                            label="پشتیبانی نشده"
                            onClick={()=>this.select(1)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="یک ادعا باید بخشی از ساختار فرضیات و نتایج یک بحث ر ا
                        تشکیل دهد. هر چیزي که این کار را انجام نمی دهد، به بحث نکته اي اضافه نمی کند و
                        یک ادعا نیست"
                    >
                        <Chip
                            className={classes.button}
                            color={this.state.selected===2?"primary":"secondary"}
                            label="ادعایی نشده است"
                            onClick={()=>this.select(2)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="این علامت باید براي نشان دادن این موضوع مورد استفاده قرار گیرد که کاربري
                        که این ادعا را علامت گذاري می کند، معناي این ادعا، یا برخی از جنبه هاي آن را درك
                        نمی کند."
                    >
                        <Chip 
                            className={classes.button} 
                            color={this.state.selected===3?"primary":"secondary"}
                            label="مبهم"   
                            onClick={()=>this.select(3)}/>
                    </Tooltip>
                    <Tooltip title=" این ادعا حمله به دیگري است، بیش از حد توهین آمیز است، و یا به طور غیر ضروري عامیانه است.">
                        <Chip
                            className={classes.button}
                            color={this.state.selected===4?"primary":"secondary"}
                            label="گستاخی / توهین"
                            onClick={()=>this.select(4)}
                        />
                    </Tooltip>
                    <Tooltip title="این ادعا یک ادعاي موجود دیگر در بحث، چه به صورت ناقص و چه به طور کامل تکرار می کند. این مورد اغلب زمانی اتفاق می افتد که یک ادعا دوبار ایجاد می شود، ویا زمانی اتفاق بیفتد که یک ادعا با استفاده از عبارت هاي مختلف چیزي به بحث اضافه نکند.">
                        <Chip
                            className={classes.button}
                            color={this.state.selected===5?"primary":"secondary"}
                            label="ادعا تکراري"
                            onClick={()=>this.select(5)}
                        />
                    </Tooltip>
                    <Tooltip title="این ادعا هیچ ارتباطی منطقی با ادعاي بالاسر خود ندارد، یا از آن حمایت نکرده یا به آن حمله نمی کند، و بنابراین به طور بالقوه در موقعیت فعلی اش بی ربط است.">
                        <Chip
                            className={classes.button}
                            color={this.state.selected===6?"primary":"secondary"}
                            label="ادعاي نامربوط"
                            onClick={()=>this.select(6)}
                        />
                    </Tooltip>
                    <Tooltip title="این ادعا حاوي مطالبی است که احتمالا باید به چندین ادعا تقسیم شود.">
                        <Chip
                            className={classes.button}
                            color={this.state.selected===7?"primary":"secondary"}
                            label="بیش از یک ادعا"
                            onClick={()=>this.select(7)}
                        />
                    </Tooltip>
                    <Tooltip title="این ادعا حاوي مطالبی است که احتمالا باید به چندین ادعا تقسیم شود.">
                        <Chip
                            className={classes.button}
                            color={this.state.selected===8?"primary":"secondary"}
                            label="انتقال به جاي دیگر"
                            onClick={()=>this.select(8)}
                        />
                    </Tooltip>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Button className='h-10' onClick={()=>this.send()}> 
                        ارسال
                    </Button>
                    </Grid>
                   
                </Grid>
                <Snackbar open={this.state.open} autoHideDuration={2000} onClose={() => this.setState({open: false})}>
                    <Alert onClose={() => this.setState({open: false})} severity={this.state.color}>
                        {this.state.text}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

export default (withStyles(useStyles) (Flag));