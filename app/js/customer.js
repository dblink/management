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
import { Input, Select } from './component/form';
import {inputChange, inputChangeDelay} from './component/formOperation';
import {ModalSection , EditorSalesman, EditorRecommend} from './module/modal';
import PageNumber from './component/pageNumber';
import IndexModule from './module/index_module';
import CustomerList from './customerList';
import {} from "../css/common.css";
import {} from "../css/screen.css";


class Customer extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      pageInfo: {},
      parameter: {
        Token: storage.getToken(),
        token: storage.getToken(),
        empID: storage.getStorage().ID,
        loginEmpId: storage.getStorage().ID,
        leaderEmpId: 0,
        lendState: -1,
        pageIndex: 1,
        customerName: "",
        customerMobile: "",
        company: -1,
        customerState: -1,
        roleID: 0
      },
      setting: [
        {
          title: "客户姓名",
          attr: "CustomerName",
          className: "width-percent-20"
        }, {
          title: "手机号",
          attr: "Mobile",
          className: "width-percent-20"
        }, {
          title: "注册时间",
          attr: "RgTime",
          className: "width-percent-10",
          format: (data)=>{
            return data.split("T")[0];
          }
        }, {
          title: "是否认证",
          attr: "CustomerName",
          className: "width-percent-15",
          format: (data)=>{
            if (data === "无"){
              return <span className="wrong-color">未认证</span>
            }else{
              return <span className="success-color">已认证</span>
            }
          }
        }, {
          title: "业务人员",
          attr: "AlotEmpName",
          setId: "ID",
          className: "width-percent-10",
          dataClass: "href-color",
          format: (data)=>{
            return <span data-show="EditorSalesman" name={data}>{data}</span>
          },
          click: (e)=>{
            this.showModal(e);
          }
        }, {
          title: "推荐人",
          attr: "EmpName",
          setId: "ID",
          className: "width-percent-15",
          dataClass: "href-color",
          format: (data)=>{
            return <span data-show="EditorCommend" name={data}>{data}</span>
          },
          click: (e)=>{
            this.showModal(e);
          }
        }, {
          title: "投资明细",
          attr: "IsLend",
          setId: "ID",
          className: "width-percent-10",
          format: (e)=>{
            if (e === 1){
              return <a className="href-color">显示</a>
            }else{
              return "无投资记录"
            }
          },
          click: (e)=>{
            if (e.currentTarget.childNodes[0].nodeType === 1){
              //console.log(e.currentTarget.id);
              storage.jump("/customer/" + e.currentTarget.id);
            }
          }
        }
      ],
      roleId: [],
      leaderEmpId: [],
      modal: {
        name: "",
        id: "",
        userName: ""
      }
    };
    this.state.company = [
      {text: "所属公司", value: "-1"},
      {text: "园区", value: "0"},
      {text: "吴中", value: "1"},
      {text: "湖西", value: "2"},
      {text: "吴中二部", value: "3"},
      {text: "湖西二部", value: "4"}
    ];
    this.state.parameter.pageSize = (13 * document.getElementById("what").offsetHeight / 955).toFixed(0);
    this.state.history = "has";
    if (this.props.params.id !== "info.html"){
      this.state.history = "";
    }
    this.showList = this.showList.bind(this);
    this.request = request.bind(this);
    this.request("getCustomerList", (data)=>{
      this.setState({
        data: data.data.length ? data.data : ["noData"],
        pageInfo: data.pageinfo
      })
    });
    this.request("getRole", (data)=>{
      let roleId = [{text: "角色未选择", value: "0"}];
      roleId.push.apply(roleId, data);
      this.setState({
        roleId: roleId
      })
    });
    this.changeIndex = this.changeIndex.bind(this);
    this.inputChange = inputChange.bind(this);
    this.inputChangeDelay = inputChangeDelay();
    this.inputChangeDelay = this.inputChangeDelay.bind(this);
    this.inputSelect = this.inputSelect.bind(this);
    this.selectLeader = this.selectLeader.bind(this);
    this.companySelect = this.companySelect.bind(this);
    this.showModal = this.showModal.bind(this);
    this.contentModal = this.contentModal.bind(this);
    this.getCustomerList = this.getCustomerList.bind(this);
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
    this.request("getCustomerList", (data) =>{
      this.setState({
        data: data.data,
        pageInfo: data.pageinfo
      })
    })
  }

  inputSelect(e){
    this.inputChange(e);
    this.inputChangeDelay(e, (()=>{
      this.request("getCustomerList", (data)=>{
        this.setState({
          data: data.data.length ? data.data : ["noData"],
          pageInfo: data.pageinfo
        })
      })
    }).bind(this))
  }

  selectLeader(e){
    this.inputChange(e);
    this.request("getLeader", (data)=>{
      let leaderEmpId = [{text: "未选择", value: "0"}];
      leaderEmpId.push.apply(leaderEmpId, data);
      this.setState({
        leaderEmpId: leaderEmpId
      })
    })
  }

  companySelect(e){
    this.inputChange(e);
    this.request("getCustomerList", (data)=>{
      this.setState({
        data: data.data.length ? data.data : ["noData"],
        pageInfo: data.pageinfo
      })
    });
    if (this.state.parameter.roleID === 0){
      return;
    }
    this.request("getLeader", (data)=>{
      let leaderEmpId = [{text: "未选择", value: "0"}];
      leaderEmpId.push.apply(leaderEmpId, data);
      this.setState({
        leaderEmpId: leaderEmpId
      })
    })
  }

  getCustomerList(){
    this.request("getCustomerList", (data)=>{
      this.setState({
        data: data.data.length ? data.data : ["noData"],
        pageInfo: data.pageinfo
      })
    });
  }

  showModal(e){
    var _show,
      _id,
      _userName;
    if (e.target){
      _show = e.target.getAttribute("data-show");
      _id = e.currentTarget.getAttribute("id");
      _userName = e.target.getAttribute("name");
      this.setState({
        modal: {
          name: _show,
          id: _id,
          userName: _userName
        }
      })
    }else{
      this.request("getCustomerList", (data)=>{
        this.setState({
          data: data.data.length ? data.data : ["noData"],
          pageInfo: data.pageinfo,
          modal: {
            name: "",
            id: "",
            userName: ""
          }
        })
      })
    }
  }

  contentModal(){
    switch (this.state.modal.name){
      case "EditorSalesman":
        return <EditorSalesman company={this.state.company}
                               closeModal={this.showModal} name={this.state.modal.userName}
                               empId={this.state.modal.id} />;
      case "EditorCommend":
        return <EditorRecommend company={this.state.company} roleId = {this.state.roleId}
                               closeModal={this.showModal} name={this.state.modal.userName}
                               empId={this.state.modal.id}/>;
    }
  }

  showList(){
    let lendState = [
      {value: "-1", text: "选择是否有记录"},
      {value: "0", text: "没有记录"},
      {value: "1", text: "有记录"}
    ];
    let customerState = [
      {value: "-1", text: "客户状态未选择"},
      {value: "0", text: "未实名"},
      {value: "1", text: "无客户经理"}
    ];
    return (<div>
      {/*客户查询*/}
      <div className="selectCustomer">
        <p className="selectGroup">客户查询</p>
        <Input placeholder="客户手机号" operate={{onChange: this.inputSelect}} name="customerMobile"/>
        <Input placeholder="客户姓名" operate={{onChange: this.inputSelect}} name="customerName"/>
        <Select option={lendState} name="lendState" operate={{onChange: this.inputSelect}} tip="是否有记录"
                value={this.state.parameter.lendState}/>
        <Select option={customerState} operate={{onChange: this.inputSelect}} name="customerState" tip="客户状态"
                value={this.state.parameter.customerState}/>
      </div>
      {/*推荐人查询*/}
      <div className="selectCustomer">
        <p className="selectGroup">推荐人查询</p>
        <Select option={this.state.company} operate={{onChange: this.companySelect}} name="company" tip="所属公司"
                value={this.state.parameter.company}/>
        <Select option={this.state.roleId} operate={{onChange: this.selectLeader}} name="roleID" tip="所属角色"
                value={this.state.parameter.roleID}/>
        <Select option={this.state.leaderEmpId} operate={{onChange: this.inputSelect}} name="leaderEmpId" tip="推荐人"
                value={this.state.parameter.leaderEmpId}/>
      </div>
      {/*表格*/}
      <Table data={this.state.data} setting={this.state.setting}/>
      {/*页码*/}
      { this.state.pageInfo.PageCount > 1 ?
        <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                    changeIndex={this.changeIndex}/> : "" }
    </div>)
  }

  render(){
    return (
      this.props.params.id !== "info.html" ?
        <CustomerList params={{id: this.props.params.id, history: this.state.history}}/>
        :
        <IndexModule showInit={this.showList} id={this.props.params.id} isShowModal={this.state.modal.name}
                     html={this.contentModal}/>
    )
  }
}

export default Customer;