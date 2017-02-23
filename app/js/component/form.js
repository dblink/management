/**
 * Created by Administrator on 2017/1/16.
 */
import {} from "../../css/common.css";
import {} from "../../css/login.css";
import React, { Component } from "react";

//form标题
class Title extends Component {
    render(){
      return (
        <div className="text-center">
          {this.props.title}
        </div>
      )
    }
}
//form 提示
class Tip extends Component {
  //初始化属性
  constructor(props) {
    super(props);
    //指向 constructor 下面的 this
    if(this.props.close && !this.props.closeTip){
      console.error("we need function 'closeTip'");
    }
  }
  render(){
    let props  = this.props;
    let status = props.color === "success" ? "success-bg-color" : "wrong-bg-color";
    return (
      <div className={status+" error "+this.props.tipState}>
        {
          this.props.close ? <Close onClick={this.props.closeTip} /> : ""
        }
        {props.content}
      </div>
    )
  }
}
Tip.defaultProps = {
  tipState: "hide",
  close: true
};
//关闭按钮
class Close extends Component {
  render(){
    let text = this.props.text ? this.props.text : "x";
    return (
      <div className="close" {...this.props}>
        {text}
      </div>
    )
  }
}
//输入框
class Input extends Component {
  render(){
    let props = this.props;
    let width = props.width;
    width = props.icon ? width-1 : width;
    width = props.imgSrc ? width-3 : width;
    let property = {
      placeholder: props.placeholder,
      type: props.type,
      className: this.props.className + " input width-percent-"+ width*10,
      value: props.value,
      name: props.name
    };
    return(
      <div className="inputGroup">
        { props.icon ? <i className="iconfont width-percent-20 text-center">{props.icon}</i> : ""}
        <input {...property} {...props.operate}/>
        { props.imgSrc ?
          <span className="width-percent-30 overflow-hidden vcode-image href-color">
            <img className="vcode" src={props.imgSrc} onClick={props.clickImage ? props.clickImage : ""} />
          </span>
          :""}
      </div>
    )
  }
}
Input.defaultProps = {
  width: 9,
  className: "",
  operate:{}
};
//选择框
class Select extends Component {
  render(){
    let props = this.props;
    let width = props.width;
    width = props.icon ? width - 1 : width;
    return(
      <div className="selectGroup">
        { props.icon ? <i className="iconfont width-percent-20 text-center">{props.icon}</i> : ""}
        <select name={props.name} {...props.operate} className={"select width-percent-"+width*10} value={props.value}>
          <option disabled="disabled" key="0" value="">{props.tip}</option>
          {
            props.option.map((line, key) => {
              return (
                <option value={line.value ? line.value : line.Value} key={key}>{line.text ? line.text : line.Text}</option>
                )
            })
          }
        </select>
      </div>
      )
  }
}
Select.defaultProps = {
  width:9,
  value: "null"
};

export {Title,Tip,Input,Select,Close}
