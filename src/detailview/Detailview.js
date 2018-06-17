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
            alarmlist:null,
            stateCode:"",
            stateName:"",
            interval:0
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
            this.setState({display:"block"});
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
        let ret = res.jsonResult.ret.alarmlist;
        this.setState({alarmlist:ret});
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
    render() {
        let content="";
        if(this.state.alarmlist !== null){
            if(this.state.alarmlist ==="false"){
                content = <strong>获取告警失败</strong>;
            }else{
                let alist =[];
                for (let i = 0; i < this.state.alarmlist.length; i++) {
                    let nickname = this.state.alarmlist[i].AlarmEName;
                    let value = this.state.alarmlist[i].AlarmValue;
                    let warning = this.state.alarmlist[i].WarningTarget;
                    let style = {};
                    if(warning === "true") style = {color:"red"};
                    alist.push(
                        <div className='col-md-6 col-sm-6 col-xs-6 column' key={"alarmkey"+i} style={{paddingBottom:15,marginRight:0}}>
                            <div style={{position:"relative",float:"left"}}>
                                <img src={"./svg/icon/"+ this.state.alarmlist[i].AlarmEName+".svg"} style={{width:"36px",hight:"36px"}}></img>
                            </div>
                            <div style={{position:"relative",float:"left",height:36,padding:8}}>
                                <label style={{maxWidth:"150px",minWidth: "50px",display:"inline-block",height:16,verticalAlign:"middle"}}>{"    " + this.state.alarmlist[i].AlarmName + ":"}
                                    <strong style={style}>{value}</strong>{this.state.alarmlist[i].AlarmUnit}
                                </label>
                            </div>
                            <hr style={{FILTER: "alpha(opacity=100,finishopacity=0,style=3)",margin:"0"}} width='80%' color="#987cb9" size="3"/>
                        </div>
                    );
                }
                content =
                    <div id ='Element_card_floating' style={{textAlign:'center'}} >
                        <div style={{padding:20}}>
                            <p style={{fontSize:"14px",fontWeight: "bold"}} >{"站点名称:"+this.state.stateName}</p>
                        </div>
                        <hr style={{FILTER: "alpha(opacity=100,finishopacity=0,style=3)",margin:0}} width='100%' color="#987cb9" size="3"/>
                        <div style={{fontSize:"10px"}} className="row" >
                            {alist}
                        </div>
                    </div>;

            }
        }
        return (
            <div className="bounceInUp" style={{position:"relative",background:"#FFFFFF",height:"100%",width:"100%",display:this.state.display}}>
                {content}
                <div style={{position:"absolute",bottom:"10px",width:"100%",left:0}}>
                    <div  className='col-md-12 col-sm-12 col-xs-12 column' style={{paddingBottom:0,marginRight:0}}>
                        <button type="button" className="btn" style={{height:36,width:36,verticalAlign:"middle",position:"relative",float:"left"}} onClick={this.clickHide.bind(this)}>
                            X
                        </button>
                        <button type="button" className="btn" style={{height:36,width:54,verticalAlign:"middle",position:"relative",float:"right"}} onClick={this.clickMore.bind(this)}>
                            详细
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}