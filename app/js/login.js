/**
 * Created by Administrator on 2016/12/29.
 */
import React, {Component} from "react";
import {} from "../css/common.css" ;
import {} from "../css/screen.css" ;
import { Title, Tip, Input, Select} from "./component/form";
import {closeTip, showTip, inputChange} from "./component/formOperation";
import { request , stop } from "./component/request";
import storage from './component/storageOperation';

class Greeger1 extends Component{
  constructor(props){
    super(props);
    this.state={
      parameter: {},
      tip: {
        text:"",
        color:"wrong"
      },
      tipState: "hide",
      image: "http://oa.chinaytjf.com/http/service/vcode?tip="
    };
    this.closeTip = closeTip.bind(this);
    this.showTip = showTip.bind(this);
    this.formInput = inputChange.bind(this);
    this.request = request.bind(this);
    this.action = this.action.bind(this);
  }
  action(e){
    e.preventDefault();
    this.request("login",(data)=>{
      if(data.error){
        this.showTip(data.error);
        return;
      }
      storage.setToken(data.Token);
      storage.setStorage(data);
      const path = '/index';
      storage.jump(path);
    });
  }
  render(){
    return (
      <div className="login-image login table">
        <div className="va-middle">
          <form className="form" onSubmit={this.action}>
            <Tip color={this.state.tip.color} content={this.state.tip.text} closeTip={this.closeTip} tipState={this.state.tipState} />
            <div className="row text-center">
              <Input type="text" operate={{onChange:this.formInput}} className="login-input" width="8" name="UserName" placeholder="请输入用户名" />
            </div>
            <div className="row text-center">
              <Input type="password" operate={{onChange:this.formInput}} className="login-input" width="8" name="Password" placeholder="请输入密码" />
            </div>
            <div className="row text-center">
              <Input type="submit" className="login-submit cursor-pointer" width="8" value="立即登录" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default Greeger1