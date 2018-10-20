/**
 * Created by Huang Yuanjie on 2018/7/21.
 */
import React, {
    Component,
    PropTypes
} from 'react';
import classNames from 'classnames';
import '../../resource/css/font-awesome.min.css';
import './Head.css';

export default class head extends Component {
    constructor(props) {
        super(props);
        this.state={
            main:{
                ifH:true,
                winWidth:800,
                winHeight:600,
            },
            height:800,
            width:1024,
            display:"block"
        }
    }
    update_size(prop){
        this.setState({main:prop});
    }
    show(bool){
        if(bool){
            this.setState({display:"block"})
        }else{
            this.setState({display:"none"})
        }
    }
    render() {
        let floatright;
        let leftwidth;
        if(this.state.main.ifH){
            floatright = <div style={{width:"70%"}} className="pull-right">
                <p style={{fontSize:"18px",fontWeight: "bold"}} className="pull-right" >占位符</p>
            </div>;
            leftwidth = "30%";
        }else{
            floatright =
                <div  className="pull-right" style={{width:"30%"}}>
                    <a href="#" className="pull-right  dropdown-toggle" data-toggle="dropdown" style={{fontSize:"24px",fontWeight: "bold"}}><i className="fa fa-bars"></i></a>
                    <ul className="dropdown-menu  pull-right">
                        <li id="menu_user_profile"><a href="#"> 占位符1</a></li>
                        <li id="menu_logout"><a href="#" >占位符2</a></li>
                    </ul>
                </div>;
            leftwidth = "70%";
        }

        return (
            <div className="bounceInUp" style={{position:"relative",background:"#FFFFFF",height:58,width:"100%",display:this.state.display,overflow:"scroll",overflowY:"scroll",overflowX:"hide"}} id="detail_panel">
                <li style={{position:"absolute",height:32,width:32,marginTop:13,marginLeft:13,
                    verticalAlign:"middle",zIndex:99}} >
                    <a href="#" > <img src="./svg/fushan_gray.png" height="32" width="32"  style={{height:32,width:32}}></img></a>
                </li>
                <div style={{padding:18}} >
                    <p style={{fontSize:"18px",fontWeight: "bold",paddingLeft:50,width:leftwidth}} className="pull-left">富珊科技</p>

                    {floatright}
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
}