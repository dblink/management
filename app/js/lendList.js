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
import PageNumber from './component/pageNumber';
import IndexModule from './module/index_module';
import {} from "../css/common.css";
import {} from "../css/screen.css";
import {} from "../css/pageNumber.css";


class LendList extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      pageInfo: [],
      parameter: {
        token: storage.getStorage().Token,
        pageIndex: 1,
        pageSize: 10
      },
      setting: [
        {
          title: "用户名",
          attr: "UserName",
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
          title: "开始日期",
          attr: "StartTime",
          className: "width-percent-20",
          format: (data)=>{
            return data.split("T")[0];
          }
        }, {
          title: "结束日期",
          attr: "EndTime",
          className: "width-percent-20",
          format: (data)=>{
            return data.split("T")[0];
          }
        }, {
          title: "业务员",
          attr: "EmpName",
          className: "width-percent-20"
        }
      ]
    };
    this.state.parameter.pageSize = (13*document.getElementById("what").offsetHeight/955).toFixed(0);
    this.showList = this.showList.bind(this);
    this.request = request.bind(this);
    this.request("getApproLendList", (data)=>{
      this.setState({
        data: data.data,
        pageInfo: data.pageinfo
      })
    });
    this.changeIndex = this.changeIndex.bind(this);
  }

  changeIndex(e) {
    e = e ? e : "1";
    let parameter = this.state.parameter;
    parameter.pageIndex = e;
    if(this.state.pageInfo.PageIndex.toString() === e){
      return;
    }
    this.setState({
      parameter: parameter
    });
    this.request("getApproLendList", (data) => {
      this.setState({
        data: data.data,
        pageInfo:data.pageinfo
      })
    })
  }

  showList(){
    return (
      <div>
        <Table data={this.state.data} setting={this.state.setting}/>
        { this.state.pageInfo.PageCount > 1 ? <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                                                          changeIndex={this.changeIndex} /> : "" }
      </div>)

  }

  render(){
    return (
      <IndexModule showInit={this.showList} id={this.props.params.id} />
    )
  }
}

export default LendList;