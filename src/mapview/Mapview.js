/**
 * Created by hyj on 2016/9/28.
 */
import React, {
    Component,
    PropTypes
    } from 'react';
import classNames from 'classnames';
import '../../resource/css/font-awesome.min.css';
import './Mapview.css';

export default class mapview extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:800,
            width:1024,
            display:"block",
            monitorList:null,
            requestHead:"",
            center:null
        }
        this._maphandle = null;
    }
    update_size(width,height,requestHead){
        this.setState({height:height,width:width,requestHead:requestHead},this.initializemap);
    }
    initializemap(){
        this._maphandle = new BMap.Map("XHMap");
        this._maphandle.centerAndZoom("Shanghai",12);
        let geolocation = new BMap.Geolocation();
        let localmap = this._maphandle;
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                localmap.panTo(r.point);
                console.log('您的位置：'+r.point.lng+','+r.point.lat);
            }
            else {
                console.log('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true});
        this.monitorlistfetch();
    }
    jsonParse(res) {
        return res.json().then(jsonResult => ({ res, jsonResult }));
    }

    monitorlistfetch(){
        var map={
            action:"MonitorList",
            type:"query",
            user:"user"
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
            .then((res)=>{this.monitorlistfetchcallback(res);})
            .catch( (error) => {
                console.log('request error', error);
                return { error };
            });
    }
    monitorlistfetchcallback(res){
        if(res.jsonResult.status == "false"){
            alert("Fetal Error, Can not get Monitor List!");
            windows.close();
        }
        if(res.jsonResult.auth == "false"){
            alert("Fetal Error, Can not get Monitor List!");
            windows.close();
        }
        let list=res.jsonResult.ret;
        this.setState({monitorList:list},this.addmarker);
    }
    showDetailTab(Detail,point){
        this.props.updateDetail(Detail);
        this.props.showDetail();
    }
    recenter(point){
        this.setState({center:point},()=>{
            this.center();
        })
    }
    center(){
        if(this.state.center!=null){
            //console.log("Map center to:"+this.state.center.lng+"|"+this.state.center.lat);
            this._maphandle.panTo(this.state.center,false);
        }
    }
    addmarker(){
        let myIcon = new BMap.Icon("./resource/images/map-marker-ball-pink-small.png", new BMap.Size(48, 48),{
            anchor: new BMap.Size(24, 45)
        });
        let xtemp = this;
        for(let i=0;i<this.state.monitorList.length;i++){
            let t_point = new BMap.Point(parseFloat(this.state.monitorList[i].Longitude),parseFloat(this.state.monitorList[i].Latitude));
            let marker = new BMap.Marker(t_point, {icon: myIcon});
            marker.setTitle(this.state.monitorList[i].StatCode+":"+this.state.monitorList[i].StatName);
            this._maphandle.addOverlay(marker);
            marker.addEventListener("click",function(){
                xtemp.showDetailTab(this.getTitle(),t_point);
                xtemp.setState({center:t_point});
                //xtemp.recenter(t_point);
            });
        }
    }
    show(bool){
        if(bool){
            this.setState({display:"block"});
        }else{
            this.setState({display:"none"})
        }
    }
    render() {
        return (
            <div id="XHMap" style={{position:"relative",background:"#eeeeee",height:'100%',width:'100%',display:this.state.display}}>

            </div>
        );
    }
}
