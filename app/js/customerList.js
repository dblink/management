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
import {Select} from './component/form';
import {inputChange} from './component/formOperation';
import {} from "../css/common.css";
import {} from "../css/screen.css";


class CustomerList extends Component {
  constructor(props){
    super(props);
    this.state= {
      data: [],
      pageInfo: {},
      name:"",
      parameter: {
        Token: storage.getToken(),
        customerId: props.params.id,
        pageSize:10,
        pageIndex:1,
        contractType:-1
      },
      contractType: [],
      setting: [
        {
          title: "金额",
          attr: "ContractMoney",
          className: "width-percent-20",
          dataClass: "wrong-color",
          format: (data)=>{
            let array = [];
            data = data.toString().split("");
            data.map((line, key) => {
              let num = data.length-key;
              if( num % 3 === 0 && num !== data.length){
                array.push(",")
              }
              array.push(line);
            });
            return array.join("");
          }
        }, {
          title: "投资名称",
          attr: "ContractName",
          className: "width-percent-20"
        },{
          title: "投资周期",
          attr: "Cycle",
          className: "width-percent-10"
        },{
          title: "年化率",
          attr: "Rate",
          className: "width-percent-15"
        },{
          title: "开始时间",
          attr: "St",
          className: "width-percent-10"
        },{
          title: "结束时间",
          attr: "Et",
          className: "width-percent-15"
        }
      ]
    };
    this.state.parameter.pageSize = (13*document.getElementById("what").offsetHeight/955).toFixed(0);
    this.showList = this.showList.bind(this);
    this.request = request.bind(this);
    this.request("getCustomerLendList",(data)=>{
      this.setState({
        data: data.data.length ? data.data : ["noData"],
        name: data.name.Value,
        pageInfo: data.pageinfo
      })
    });
    this.changeIndex = this.changeIndex.bind(this);
    this.inputChange = inputChange.bind(this);
    this.request("getContractType", (data)=>{
      let type = [{value: -1, text: "合同类型"}];
      type.push.apply(type, data.data);
      this.setState({
        contractType: type
      })
    });
    this.selectContractType = this.selectContractType.bind(this);
  }
  changeIndex(e){
    e = e ? e : "1";
    let parameter = this.state.parameter;
    parameter.pageIndex = e;
    if (this.state.pageInfo.PageIndex.toString() === e){
      return;
    }
    this.setState({
      parameter: parameter
    });
    this.request("getCustomerLendList", (data) =>{
      this.setState({
        data: data.data,
        name: data.name.Value,
        pageInfo: data.pageinfo
      })
    })
  }

  selectContractType(e){
    this.inputChange(e);
    this.request("getCustomerLendList", (data)=>{
      this.setState({
        data: data.data.length ? data.data : ["noData"],
        name: data.name.Value,
        pageInfo: data.pageinfo
      })
    })
  }

  showList(){
    return (<div>
      {/*推荐人查询*/}
      <div className="selectCustomer">
        <p className="selectGroup">合同类型</p>
        <Select option={this.state.contractType} operate={{onChange: this.selectContractType}} name="contractType" tip="合同类型"
                value={this.state.parameter.contractType}/>
      </div>
      <div className="menu text-center">“<span className="success-color">{this.state.name}</span>”的投资记录</div>
      <Table data={this.state.data} setting={this.state.setting}/>
      { this.state.pageInfo.PageCount > 1 ? <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                                                        changeIndex={this.changeIndex} /> : "" }
    </div>)
  }

  render(){
    return (
      <IndexModule showInit={this.showList} id={this.props.params.id} history={this.props.params.history} />
    )
  }
}

export default CustomerList;