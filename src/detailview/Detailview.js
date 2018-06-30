/**
 * Created by hyj on 2016/9/28.
 */
import React, {
    Component,
    PropTypes
    } from 'react';
import classNames from 'classnames';
import '../../resource/css/font-awesome.min.css';
import './Detailview.css';

export default class head extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:800,
            width:1024,
            display:"none",
            detail:"",
            requestHead:"",
            towerstatus:null,
            stateCode:"",
            stateName:"",
            interval:0,
            subdisplay:{
                status_more:"block",
                sensor_hide:"none",
                sensor_panel:"none",
                sensor_more:"none",
                light_hide:"none",
                light_panel:"none",
                light_more:"none",
                photo_hide:"none",
                photo_panel:"none"
            }
        }
    }
    update_size(width,height,requestHead){
        this.setState({height:height,width:width,requestHead:requestHead});
        let inter = setInterval(()=>{
            if(this.state.display === "none" || this.state.stateCode === "") return;
            this.devalarmfetch();
        },30000);
        this.setState({interval:inter});
    }
    setDetail(detail){
        //console.log("Detail set"+detail);
        this.setState({detail:detail});
        this.getSelectMonitor(detail);
    }
    getSelectMonitor(title){
        var temp = title.split(":");
        this.setState({stateCode:temp[0],stateName:temp[1]},this.devalarmfetch);
    }
    show(bool){
        if(bool){
            this.setState({display:"block",subdisplay:{
                status_more:"block",
                sensor_hide:"none",
                sensor_panel:"none",
                sensor_more:"none",
                light_hide:"none",
                light_panel:"none",
                light_more:"none",
                photo_hide:"none",
                photo_panel:"none"
            }});
        }else{
            this.setState({display:"none"})
        }
    }
    devalarmfetch(){
        var body = {StatCode: this.state.stateCode};
        var map = {
            action: "DevAlarm",
            body: body,
            type: "query",
            user: "user"
        };
        fetch(this.state.requestHead,
            {
                method:'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(map)
            }).then(this.jsonParse)
            .then((res)=>{this.devalarmfetchcallback(res);})
            .catch( (error) => {
                console.log('request error', error);
                return { error };
            });
    }
    devalarmfetchcallback(res){
        if(res.jsonResult.status == "false"){
            alert("Fetal Error, Can not get Dev alarm!");
            windows.close();
        }
        if(res.jsonResult.auth == "false"){
            alert("Fetal Error, Can not get Dev alarm!");
            windows.close();
        }
        let ret = res.jsonResult.ret;
        this.setState({towerstatus:ret});
    }
    componentDidUpdate(){
        let height = document.getElementById("detail_panel").offsetHeight;
        //console.log("offsetHeight:"+height);
        this.props.resetMapHeight(height);
    }

    jsonParse(res) {
        return res.json().then(jsonResult => ({ res, jsonResult }));
    }
    clickHide(){
        this.props.hideDetail();
    }
    clickMore(){
        console.log("click more");
    }
    clickStatusMore(){
        this.setState({
            subdisplay:{
            status_more:"none",
            sensor_hide:"block",
            sensor_panel:"block",
            sensor_more:"block",
            light_hide:"none",
            light_panel:"none",
            light_more:"none",
            photo_hide:"none",
            photo_panel:"none"
        }});
    }
    clickSensorHide(){
        this.setState({
            subdisplay:{
                status_more:"block",
                sensor_hide:"none",
                sensor_panel:"none",
                sensor_more:"none",
                light_hide:"none",
                light_panel:"none",
                light_more:"none",
                photo_hide:"none",
                photo_panel:"none"
            }});
    }

    clickSensorMore(){
        this.setState({
            subdisplay:{
                status_more:"none",
                sensor_hide:"block",
                sensor_panel:"block",
                sensor_more:"none",
                light_hide:"block",
                light_panel:"block",
                light_more:"block",
                photo_hide:"none",
                photo_panel:"none"
            }});
    }
    clickLightHide(){
        this.setState({
            subdisplay:{
                status_more:"none",
                sensor_hide:"block",
                sensor_panel:"block",
                sensor_more:"block",
                light_hide:"none",
                light_panel:"none",
                light_more:"none",
                photo_hide:"none",
                photo_panel:"none"
            }});
    }
    clickLightMore(){
        this.setState({
            subdisplay:{
                status_more:"none",
                sensor_hide:"block",
                sensor_panel:"block",
                sensor_more:"none",
                light_hide:"block",
                light_panel:"block",
                light_more:"none",
                photo_hide:"block",
                photo_panel:"block"
            }});
    }
    clickPhotoHide(){
        this.setState({
            subdisplay:{
                status_more:"none",
                sensor_hide:"block",
                sensor_panel:"block",
                sensor_more:"none",
                light_hide:"block",
                light_panel:"block",
                light_more:"block",
                photo_hide:"none",
                photo_panel:"none"
            }});
    }
    render() {

        let detailPanel="";
        let alarmPanel="";
        let statusPanel="";
        let lightPanel="";
        let photoPanel="";
        if(this.state.towerstatus!== null){
            if(this.state.towerstatus==="false"){
                alarmPanel = <strong>获取详细信息失败</strong>;
            }else{
                let slist = [];
                for (let i = 0; i < this.state.towerstatus.statuslist.length; i++) {

                    let name = this.state.towerstatus.statuslist[i].name;
                    let value = this.state.towerstatus.statuslist[i].value;
                    slist.push(
                        <div className='col-md-12 col-sm-12 col-xs-12 column' key={"statuskey"+i} style={{paddingBottom:15,marginRight:0}}>
                            <div style={{position:"relative",float:"left",height:18}}>
                                <label style={{width:"100%",display:"inline-block",height:16,verticalAlign:"middle",paddingLeft:15}}>
                                    { name + ":"+value}
                                </label>
                            </div>
                        </div>
                    );
                }
                statusPanel =
                    <div style={{fontSize:"10px"}} className="row" >
                        <div className="clearfix"></div>
                        <div className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:15,marginRight:0}}>
                            <p style={{fontSize:"12px",fontWeight: "bold",float:"left",marginLeft:15}} >{this.state.towerstatus.statustitle}</p>
                        </div>
                        {slist}
                        <div className="clearfix"></div>
                        <div style={{position:"relative",bottom:"10px",width:"100%",left:0,display:this.state.subdisplay.status_more}}>
                            <div  className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:0,marginRight:0}}>
                                <li style={{height:18,width:18,verticalAlign:"middle",position:"relative",float:"right",zIndex:99}} >
                                    <a onClick={this.clickStatusMore.bind(this)} href="#" ><i className="fa fa-angle-down"></i></a>
                                </li>
                            </div>
                        </div>
                    </div>

                let alist =[];

                for (let i = 0; i < this.state.towerstatus.alarmlist.length; i++) {

                    let nickname = this.state.towerstatus.alarmlist[i].AlarmEName;
                    let value = this.state.towerstatus.alarmlist[i].AlarmValue;
                    let warning = this.state.towerstatus.alarmlist[i].WarningTarget;
                    let style = {};
                    if(warning === "true") style = {color:"red"};
                    alist.push(
                        <div className='col-md-6 col-sm-6 col-xs-6 column' key={"alarmkey"+i} style={{paddingBottom:15,marginRight:0}}>
                            <div style={{position:"relative",float:"left"}}>
                                <img src={"./svg/icon/"+ this.state.towerstatus.alarmlist[i].AlarmEName+".svg"} style={{width:"36px",hight:"36px"}}></img>
                            </div>
                            <div style={{position:"relative",float:"left",height:36,padding:8}}>
                                <label style={{maxWidth:"150px",minWidth: "50px",display:"inline-block",height:16,verticalAlign:"middle",paddingLeft:10}}>{ this.state.towerstatus.alarmlist[i].AlarmName + ":"}
                                    <strong style={style}>{value}</strong>{this.state.towerstatus.alarmlist[i].AlarmUnit}
                                </label>
                            </div>
                        </div>
                    );
                }
                alarmPanel =
                        <div style={{fontSize:"10px"}} className="row" >
                            <div style={{position:"relative",bottom:"10px",width:"100%",left:0,display:this.state.subdisplay.sensor_hide}}>
                                <div  className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:0,marginRight:0}}>
                                    <li style={{height:18,width:18,verticalAlign:"middle",position:"relative",float:"right",zIndex:99}} >
                                        <a onClick={this.clickSensorHide.bind(this)} href="#" ><i className="fa fa-angle-up"></i></a>
                                    </li>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                            <div style={{display:this.state.subdisplay.sensor_panel}}>
                                <div className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:15,marginRight:0}}>
                                    <p style={{fontSize:"12px",fontWeight: "bold",float:"left",marginLeft:15}} >{this.state.towerstatus.alarmtitle}</p>
                                </div>
                                {alist}
                            </div>
                            <div className="clearfix"></div>
                            <div style={{position:"relative",bottom:"10px",width:"100%",left:0,display:this.state.subdisplay.sensor_more}}>
                                <div  className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:0,marginRight:0}}>
                                    <li style={{height:18,width:18,verticalAlign:"middle",position:"relative",float:"right",zIndex:99}} >
                                        <a onClick={this.clickSensorMore.bind(this)} href="#" ><i className="fa fa-angle-down"></i></a>
                                    </li>
                                </div>
                            </div>
                        </div>

                let llist= [];
                for (let i = 0; i < this.state.towerstatus.lightlist.length; i++) {

                    let name = this.state.towerstatus.lightlist[i].name;
                    let value = this.state.towerstatus.lightlist[i].value;
                    llist.push(
                        <div className='col-md-12 col-sm-12 col-xs-12 column' key={"lightkey"+i} style={{paddingBottom:15,marginRight:0}}>
                            <div style={{position:"relative",float:"left",height:18}}>
                                <label style={{width:"100%",display:"inline-block",height:16,verticalAlign:"middle",paddingLeft:15}}>
                                    { name + ":"+value}
                                </label>
                            </div>
                        </div>
                    );
                }
                lightPanel =
                    <div style={{fontSize:"10px"}} className="row" >
                        <div style={{position:"relative",bottom:"10px",width:"100%",left:0,display:this.state.subdisplay.light_hide}}>
                            <div  className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:0,marginRight:0}}>
                                <li style={{height:18,width:18,verticalAlign:"middle",position:"relative",float:"right",zIndex:99}} >
                                    <a onClick={this.clickLightHide.bind(this)} href="#" ><i className="fa fa-angle-up"></i></a>
                                </li>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <div style={{display:this.state.subdisplay.light_panel}}>
                            <div className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:15,marginRight:0}}>
                                <p style={{fontSize:"12px",fontWeight: "bold",float:"left",marginLeft:15}} >{this.state.towerstatus.lighttitle}</p>
                            </div>
                            {llist}
                        </div>
                        <div className="clearfix"></div>
                        <div style={{position:"relative",bottom:"10px",width:"100%",left:0,display:this.state.subdisplay.light_more}}>
                            <div  className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:0,marginRight:0}}>
                                <li style={{height:18,width:18,verticalAlign:"middle",position:"relative",float:"right",zIndex:99}} >
                                    <a onClick={this.clickLightMore.bind(this)} href="#" ><i className="fa fa-angle-down"></i></a>
                                </li>
                            </div>
                        </div>
                    </div>

                let plist= [];
                for (let i = 0; i < this.state.towerstatus.photolist.length; i++) {

                    let name = this.state.towerstatus.photolist[i].name;
                    let value = this.state.towerstatus.photolist[i].value;
                    plist.push(
                        <div className='col-md-12 col-sm-12 col-xs-12 column' key={"lightkey"+i} style={{paddingBottom:15,marginRight:0}}>
                            <div style={{position:"relative",float:"left",height:18}}>
                                <label style={{width:"100%",display:"inline-block",height:16,verticalAlign:"middle",paddingLeft:15}}>
                                    { name + ":"+value}
                                </label>
                            </div>
                            <div className='col-md-12 col-sm-12 col-xs-12 column' key={"lightkey"+i} style={{paddingBottom:0}} >
                                <img src={this.state.towerstatus.photolist[i].url} style={{width:"100%"}}></img>
                            </div>
                        </div>
                    );
                }
                photoPanel =
                    <div style={{fontSize:"10px"}} className="row" >
                        <div style={{position:"relative",bottom:"10px",width:"100%",left:0,display:this.state.subdisplay.photo_hide}}>
                            <div  className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:0,marginRight:0}}>
                                <li style={{height:18,width:18,verticalAlign:"middle",position:"relative",float:"right",zIndex:99}} >
                                    <a onClick={this.clickPhotoHide.bind(this)} href="#" ><i className="fa fa-angle-up"></i></a>
                                </li>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <div style={{display:this.state.subdisplay.photo_panel}}>
                            <div className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:15,marginRight:0}}>
                                <p style={{fontSize:"12px",fontWeight: "bold",float:"left",marginLeft:15}} >{this.state.towerstatus.lighttitle}</p>
                            </div>
                            {plist}
                        </div>
                        <div className="clearfix"></div>
                    </div>

            }
            detailPanel =
                <div id ='Element_card_floating' style={{position:'relative',textAlign:'center'}} >
                    <div style={{padding:20}}>
                        <p style={{fontSize:"14px",fontWeight: "bold"}} >{"站点名称:"+this.state.stateName}</p>
                    </div>
                    <div style={{width:'100%',paddingBottom:15}}>
                        <hr style={{FILTER: "alpha(opacity=100,finishopacity=0,style=3)",margin:0}} width='100%' color="#987cb9" size="3"/>

                    </div>
                    {statusPanel}
                    {alarmPanel}
                    {lightPanel}
                    {photoPanel}
                </div>;
        }
        return (
            <div className="bounceInUp" style={{position:"relative",background:"#FFFFFF",height:"100%",width:"100%",display:this.state.display,overflow:"scroll",overflowY:"scroll",overflowX:"hide"}} id="detail_panel">
                <li style={{position:"absolute",height:18,width:18,marginTop:20,marginLeft:20,
                    verticalAlign:"middle",zIndex:99}} >
                    <a onClick={this.clickHide.bind(this)} href="#" ><i className="fa fa-arrow-left"></i></a>
                </li>

                {detailPanel}

                <div className="clearfix"></div>
            </div>
        );
    }
}