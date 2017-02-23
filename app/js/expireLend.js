/**
 * Created by Administrator on 2017/2/13.
 */
/**
 * Created by Administrator on 2017/1/13.
 */
import {} from "../css/index.css";
import React, { Component } from 'react'
import storage from './component/storageOperation';
import {request ,stop} from './component/request';
import Table from './component/table';
import IndexModule from './module/index_module';
import {} from "../css/common.css";
import {} from "../css/screen.css";


class expireLend extends Component {
  constructor(props){
    super(props);
    let date = new Date();
    this.state = {
      data: [],
      parameter: {
        token: storage.getStorage().Token,
        state: 0,
        startTime: date.getFullYear() + "." + parseInt(1 + date.getMonth()) + ".01",
        endTime: date.getFullYear() + "." + parseInt(1 + date.getMonth()) + "." + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
      },
      setting: [
        , {
          title: "投资项目",
          attr: "Title",
          className: "width-percent-20"
        }, {
          title: "客户名",
          attr: "CustomerName",
          className: "width-percent-20"
        }, {
          title: "投资金额",
          attr: "Money",
          className: "width-percent-20",
          dataClass: "wrong-color",
          format: (data)=>{
            let array = [];
            data = data.toString().split("");
            data.map((line, key) =>{
              let num = data.length - key;
              if (num % 3 === 0 && num !== data.length){
                array.push(",")
              }
              array.push(line);
            });
            return array.join("");
          }
        }, {
          title: "结束日期",
          attr: "EndTime",
          className: "width-percent-20",
          format: (data)=>{
            return data.split("T")[0];
          }
        }, {
          title: "推荐人",
          attr: "EmpName",
          className: "width-percent-20"
        }
      ]
    };
    this.showList = this.showList.bind(this);
    this.request = request.bind(this);
    this.request("getIndex", (data)=>{
      this.setState({
        data: data.expireLend.data
      })
    });
  }

  loginOut(){
    storage.clearStorage();
    storage.clearStorage("menu");
    storage.clearToken();
    storage.jump("/");
  }

  toBack(){
    history.go(-1);
  }

  showList(){
    return <Table data={this.state.data} setting={this.state.setting}/>
  }

  render(){
    return (
      <IndexModule showInit={this.showList} id={this.props.params.id} />
    )
  }
}

export default expireLend;