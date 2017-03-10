/**
 * Created by Administrator on 2017/2/5.
 */
import React, { Component } from 'react';
import role from "../../role.setting.json";
import {} from "../../css/font/iconfont.css";
import {} from "../../css/dataModule.css";
import imgFirst from "../../img/iconcrown/crown_first.png";
import imgSecond from "../../img/iconcrown/crown_second.png";
import imgThird from "../../img/iconcrown/crown_third.png";
import loading from "../../img/loading.gif";

class Title extends Component{
  constructor(props){
    super(props);
    this.dataBind = this.dataBind.bind(this);
  }
  dataBind() {
    switch (this.props.ranking){
      case 1: return <img src={imgFirst} />;
      case 2: return <img src={imgSecond} />;
      case 3: return <img src={imgThird} />;
      default : break
    }
  }
  shouldComponentUpdate(nextProps){
    return nextProps !== this.props
  }
  render(){
    return (
      <div className="dataModule-company clear-both">
        <div>
          <span className="crown">{this.dataBind()}</span>
          {this.props.data}
          {
            this.props.chiefName ?
              <span className="moduleColorGreen">{this.props.chiefName}</span>
              : ""
          }
          {
            role[this.props.role-1] ? role[this.props.role-1] : ""
          }
          {
            this.props.name ?
              <span className="moduleColorGreen">{this.props.name}</span>
              : ""
          }
          {role[this.props.role]}
        </div>
      </div>
    )
  }
}
class Download extends Component{
  constructor(props){
    super(props);
    this.down = this.down.bind(this);
  }
  down(){
    location.href = this.props.href;
  }
  render(){
    return (
      <a onClick={this.down} className="iconfont download">&#xe621;</a>
    )
  }
}
class Body extends Component{
  render(){
    return (
      <div className="dataModule-data clear-both a" data-id={this.props.id} onClick={this.props.onClick} data-truth={this.props.truth}>
        <div className="va-middle">{this.props.data}</div>
      </div>
    )
  }
}
Body.defaultProps = {
  data: <img src={loading} />
};

class FunctionKey extends Component{
  render(){
    return (
      <div className="dataModule-date clear-both" onClick={this.props.func} id={this.props.id} data-key={this.props.keyId}
           data-role={this.props.roleId} data-id={this.props.empId}>
        <a className="text-center block">
          {this.props.data}
        </a>
      </div>
    )
  }
}
class Footer extends Component{
  render(){
    return (
      <div className="dataModule-date clear-both">
        <div className="block-2">{this.props.left}</div>
        <div className="block-2">{this.props.right}</div>
      </div>
    )
  }
}
class DateTime extends Component{
  render(){
    return (
      <div className="dataModule-date clear-both">
        {this.props.checkbox ?<div className="block-2">
           <input type="checkbox" value="1" name="state" onClick={this.props.inputChange} />
            实际数据
        </div>
          : ""}
        <div className="module-spe-style text-right">
          {this.props.data}：{this.props.time}
        </div>
      </div>
    )
  }
}
class Modal extends Component{
  shouldComponentUpdate(nextProps){
    return nextProps !== this.props
  }
  render(){
    return (
      <div className={"dataModal "+this.props.switch}>
        {this.props.data}
      </div>
    )
  }
}

const Module = {
  Title: Title,
  Download: Download,
  Body: Body,
  DateTime: DateTime,
  Footer: Footer,
  FunctionKey: FunctionKey,
  Modal: Modal
};

export default Module