/**
 * Created by hyj on 2016/9/5.
 */
import React,  {
    Component,
    PropTypes
    }from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';


import Billboardview from "../billboardview/Billboardview"
import Chartview from "../chartview/Chartview"
import Detailview from "../detailview/Detailview"
import Mapview from "../mapview/Mapview"
import './App.css';
import '../../resource/css/explore.css';
import '../../resource/css/main.css';
import '../../resource/css/new_index.css';
import '../../resource/css/setting.css';
import '../../resource/css/style.css';
import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();



var winWidth;
var winHeight;

var basic_address = getRelativeURL()+"/";
var request_head= basic_address+"request.php";

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            main:{
                ifH:true,
                winWidth:800,
                winHeight:600,
            },
            ifLeftShow:false,
            ifRightShow:false,
            mapHeight:600
        };
        this._requirehead = "";

        this._showDetail=this.showDetail.bind(this);
        this._updateDetail=this.updateDetail.bind(this);
        this._hideDetail=this.hideDetail.bind(this);
        this._resetMapHeight=this.resetMapHeight.bind(this);
    }
    initialize(prop,request_head){
        this._requirehead = request_head;
        this.setState({main:prop,mapHeight:prop.winHeight});
        this.refs.Map.update_size(prop.winWidth,prop.winHeight,request_head);
        this.refs.Detail.update_size(prop.winWidth,prop.winHeight,request_head);
    }
    resetMapHeight(height){
        let local_height = this.state.main.winHeight - height;
        if (local_height <0) local_height = 0;
        if(this.state.mapHeight === local_height)return;
        this.setState({mapHeight:local_height});
    }
    ifshow(){
        if(this.refs.Detail.show()){
            return true;
        }
        return false;
    }
    updateMonitorList(list){
        this.setState({monitorList:list});
    }
    updateDetail(Detail){
        this.refs.Detail.setDetail(Detail);
    }
    goCenter(point){
        this.refs.Map.recenter(point);
    }
    showDetail(point){
        this.refs.Detail.show(true);
        this.setState({ifLeftShow:true},()=>{this.goCenter(point)});
    }
    hideDetail(){
        this.refs.Detail.show(false);
        this.setState({ifLeftShow:false});
    }
    render() {
        let leftstyle;
        let mainstyle;
        if(this.state.main.ifH){
            if(this.state.ifLeftShow){
                leftstyle = {position:"absolute",height:this.state.main.winHeight,width:this.state.main.winWidth/2};
                mainstyle = {position:"relative",height:this.state.main.winHeight,marginLeft:this.state.main.winWidth/2,width:"100%"};
            }else{
                leftstyle = {position:"absolute",height:this.state.main.winHeight,width:0};
                mainstyle = {position:"relative",height:this.state.main.winHeight,marginLeft:0,width:"100%"};
            }
        }else{
            if(this.state.ifLeftShow){
                leftstyle = {position:"relative",width:"100%"};
                mainstyle = {position:"relative",height:this.state.mapHeight,width:"100%"};
            }else{
                leftstyle = {position:"relative",height:0,width:"100%"};
                mainstyle = {position:"relative",height:this.state.main.winHeight,width:"100%"};
            }
        }
        return (
            <div style={{position:"relative",background:"#DDDDDD",height:this.state.height,maxHeight:this.state.height,width:'100%',overflowY:'hidden',overflowX:'hidden'}}>
                <div style={leftstyle}>
                    <Detailview ref="Detail" hideDetail={this._hideDetail}
                                resetMapHeight={this._resetMapHeight}/>
                </div>

                <div className="clearfix"></div>
                <div style={mainstyle}>
                    <Mapview ref="Map"
                             showDetail={this._showDetail}
                             updateDetail={this._updateDetail}
                    />
                </div>

                <div className="clearfix"></div>
            </div>
        );

    }

}
var wait_time_long =3000;
var wait_time_middle = 1000;
var wait_time_short= 500;
var cycle_time = 60000;
var show_time = 15000;
var mainProp={
    ifmobile:get_mobile(),
    winWidth:800,
    winHeight:600
}
get_size();
var react_element = <App/>;
var app_handle = ReactDOM.render(react_element,document.getElementById('app'));
app_handle.initialize(mainProp,request_head);


$(window).resize(function() {
    get_size();
    //(document.body).setAttribute("height", mainProp.winHeight);
    app_handle.initialize(mainProp,request_head);
});
function get_size(){
    let winWidth;
    let winHeight;
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    //console.log("innerWidth = "+window.innerWidth);
    //console.log("innerHeight= "+window.innerHeight);
    console.log("winWidth = "+winWidth);
    console.log("winHeight= "+winHeight);
    let ifH=false;
    if(winWidth >= winHeight){//横屏
        ifH=true;
    }
    mainProp={
        ifH:ifH,
        winWidth:winWidth,
        winHeight:winHeight
    }
}
function getLocation()
{
    console.log("正在获取位置！");
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("无法获得当前位置！");
    }
}
function showPosition(position)
{
    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.longitude);
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
}


function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}


function get_mobile(){
    return false;
}

function jsonParse(res) {
    return res.json().then(jsonResult => ({ res, jsonResult }));
}
function getRelativeURL(){
    var url = document.location.toString();
    var arrUrl= url.split("://");
    var start = arrUrl[1].indexOf("/");
    var reUrl=arrUrl[1].substring(start);
    if(reUrl.indexOf("?")!=-1) {
        reUrl = reUrl.split("?")[0];
    }
    var end = reUrl.lastIndexOf("/");
    reUrl=reUrl.substring(0,end);

    reUrl=reUrl.replace(/\/\/*/, "/");
    return reUrl;
}




function sysversionfetch(){
    var map={
        action:"XH_Balance_sys_version",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(sysversionfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function sysversionfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get language file!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get language file!");
        windows.close();
    }
    let version=res.jsonResult.ret;
    app_handle.updateVersion(version);
}
function get_user_information(){
    var session = getQueryString("session");
    var body = {
        session: session
    };
    var map={
        action:"UserInfo",
        type:"query",
        body: body,
        user:"null"
    };
    fetch(request_head,
    {
        method:'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(map)
    }).then(jsonParse)
    .then(get_user_information_callback)
    .catch( (error) => {
        console.log('request error', error);
        return { error };
    });
}
function get_user_information_callback(result){
    var ret = result.status;
    if(ret == "false"){
        alert("Fetal Error, Can not get language file!");
        windows.close();
    }else{
        usr = result.ret;
        get_alarm_type_list();
        nav_check();
        get_sensor_list();
        get_camera_unit();
        get_project_list();
        get_product_model();
    }
}
function get_project_list(){
    var map={
        action:"ProjectList",
        type:"query",
        user:usr.id
    };
    var get_project_list_callback = function(result){
        if(result.status == "false"){
            alert("Fetal Error, Can not get language file!");
            windows.close();
        }
        project_list = result.ret;
    };
    JQ_get(request_head,map,get_project_list_callback);
}
function get_alarm_type_list(){
    var map={
        action:"AlarmType",
        type:"query",
        user:usr.id
    };
    var get_alarm_type_list_callback = function(result){
        if(result.status == "false"){
            show_expiredModule();
            return;
        }
        alarm_type_list= result.ret;
        build_alarm_tabs2();
    };
    JQ_get(request_head,map,get_alarm_type_list_callback);
}

function nav_check(){
    /*
    $("#Hello_label").text("您好："+usr.name);
    var $b_label = $(+" <b class='caret'></b>");
    $("#Hello_label").append("<span class=' fa fa-angle-down'></span>");
    */
}
function get_sensor_list(){
    var map={
        action:"SensorList",
        type:"query",
        user:usr.id
    };
    var get_sensor_list_callback = function(result){
        if(result.status == "false"){
            show_expiredModule();
            return;
        }
        sensor_list= result.ret;
    };
    JQ_get(request_head,map,get_sensor_list_callback);
}
function get_product_model(){
    var map={
        action:"ProductModel",
        type:"query",
        user:usr.id
    };
    var get_product_model_callback = function(result){
        var ret = result.status;
        if(ret == "true"){
            product_model = result.ret;
        }else {
            show_alarm_module(true, "请重新登录！" + result.msg, null);
        }
    };
    JQ_get(request_head,map,get_product_model_callback);
}