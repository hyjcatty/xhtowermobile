/**
 * Created by hyj on 2016/9/28.
 */
import React, {
    Component,
    PropTypes
    } from 'react';
import classNames from 'classnames';
import '../../resource/css/font-awesome.min.css';
import './Chartview.css';

export default class head extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:800,
            width:1024,
            display:"block"
        }
    }
    update_size(width,height){
        this.setState({height:width,height})
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
            <div style={{position:"relative",background:"#eeeeee",height:this.state.height,width:'100%',display:'table'}}>
                chartview
            </div>
        );
    }
}