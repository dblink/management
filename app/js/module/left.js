/**
 * Created by Administrator on 2017/2/4.
 */
import React, { Component } from 'react';
import {Link} from 'react-router';
import ajx , {request,stop} from '../component/request';
import storage from '../component/storageOperation';
import List from '../component/menu';
import img from '../../img/ytlogo.png';

class Left extends Component {
  constructor(props){
    super(props);
    let data = storage.getStorage();
    this.state = {
      //请求参数
      parameter: {
        empId: data.ID,
        groupId: data.GroupID,
        token: data.Token
      },
      menu:[]
    };
    this.request = request.bind(this);
    if(storage.getStorage("menu")){
      this.state.menu = storage.getStorage("menu");
      return;
    }
    this.request("getMenu", (data)=>{
      this.setState({menu: data});
      storage.setStorage(data, "menu");
    });
  }
  render() {
    let clicked = "";
    if(location.pathname.indexOf("customer") !== -1){
      clicked = "0";
    }
    if(location.pathname.indexOf("emp") !== -1){
      clicked = "1";
    }
    if(location.pathname.indexOf("statistics") !== -1){
      clicked = "2";
    }
    return (
      <div className="block-2-15 height-full phone-bottom-bar">
        <div className="user-info clear-both phone-hidden">
          <img src={img} className="width-percent-80 block block-center" />
          <div className="block-2-40 text-center">
            欢迎
          </div>
          <div className="block-2-60">
            {storage.getStorage().Name}
          </div>
          <div  className="block-2-90 text-center">
            <a onClick={this.props.onClick} data-name="forget" >修改密码</a>
          </div>
        </div>
        <List clicked={clicked} data={this.state.menu} />
      </div>
    )
  }
}


export default Left;