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
import {ModalSection, AddEmployee, EditorEmployee, QuitJob} from './module/modal';
import {Input, Select} from './component/form';
import {inputChange, inputChangeDelay} from './component/formOperation';
import {} from "../css/common.css";
import {} from "../css/screen.css";


class Employees extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      pageInfo: {},
      parameter: {
        Token: storage.getToken(),
        token: storage.getToken(),
        empID: storage.getStorage().ID,
        empId: storage.getStorage().ID,
        empIdString: "",
        roleId: storage.getStorage().Role,
        mobile: "",
        empName: "",
        chief: "",
        company: -1,
        pageIndex: 1,
        pageSize: 15,
        roleID: "-1"
      },
      setting: [
        {
          title: "姓名",
          attr: "Name",
          className: "width-percent-15"
        }, {
          title: "手机号",
          attr: "Mobile",
          className: "width-percent-15"
        }, {
          title: "上级",
          attr: "ChiefName",
          className: "width-percent-10"
        }, {
          title: "角色",
          attr: "RoleName",
          className: "width-percent-15"
        }, {
          title: "是否离职",
          attr: "IsDismision",
          className: "width-percent-10",
          format: (e)=>{
            if(e === "否"){
              return <span className="success-color">{e}</span>
            }else{
              return <sapn className="wrong-color">{e}</sapn>
            }
          }
        }, {
          title: "公司",
          attr: "CompanyName",
          setId: "EmpNameId",
          className: "width-percent-15"
        }, {
          title: "操作",
          attr: "Name",
          setId: "Id",
          className: "width-percent-10",
          dataClass: "href-color",
          format: (e)=>{
            return <div className="table-operate clear-both">
              <a name={e} className="href-color" data-show="QuitJob" >离职</a>
              <a name={e} className="href-color" data-show="EditorEmployee">修改</a>
            </div>
          },
          click: (e)=>{
            this.showModal(e);
          }
        }
      ],
      roleId: [],
      leader: [],
      operate: {
        tip: "",
        click: "close",
        buttonName: "批量离职"
      },
      modal: {
        name: "",
        id:""
      }
    };
    this.state.parameter.pageSize = (13*document.getElementById("what").offsetHeight/955).toFixed(0);
    this.state.company = [
      {text: "所属公司", value: "-1"},
      {text: "园区", value: "0"},
      {text: "吴中", value: "1"},
      {text: "湖西", value: "2"},
      {text: "吴中二部", value: "3"}
    ];
    this.showList = this.showList.bind(this);
    this.request = request.bind(this);
    this.request("getEmployeesList", (data)=>{
      this.setState({
        data: data.data.length ? data.data : ["noData"],
        pageInfo: data.pageinfo
      })
    });
    this.request("getRole", (data)=>{
      let role = [{value:"-1",text: "选择角色"}];
      role.push.apply(role, data);
      this.setState({
        roleId: role
      })
    });
    this.changeIndex = this.changeIndex.bind(this);
    this.inputChange = inputChange.bind(this);
    this.inputChangeDelay = inputChangeDelay.bind(this);
    this.inputChangeDelay = this.inputChangeDelay(); //延迟改变功能
    this.leaderSelect = this.leaderSelect.bind(this); //查找上级
    this.inputSelect = this.inputSelect.bind(this); // 条件查询
    this.allSelect  = this.allSelect.bind(this); //总查找（上级及条件查询）
    this.someQuit = this.someQuit.bind(this); //批量删除功能
    this.rowsOperation = this.rowsOperation.bind(this); //行操作功能
    this.showModal = this.showModal.bind(this); //模态框显示和关闭
    this.contentModal = this.contentModal.bind(this); //模态框内容
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
    this.request("getEmployeesList", (data) =>{
      this.setState({
        data: data.data,
        pageInfo: data.pageinfo
      })
    })
  }

  inputSelect(e){
    this.inputChange(e);
    this.inputChangeDelay(e, (()=>{
      this.request("getEmployeesList", (data)=>{
        this.setState({
          data: data.data.length ? data.data : ["noData"],
          pageInfo: data.pageinfo
        })
      })
    }).bind(this))
  }

  leaderSelect(e){
    this.inputChange(e);
    this.request("getLeader", (data) =>{
      let _leader = [{value: "", text:"选择上级"}];
      _leader.push.apply(_leader,data);
      this.setState({
        leader: _leader
      })
    })
  }

  allSelect(e){
    let _parameter = this.state.parameter;
    _parameter.chief = "";
    this.setState({parameter: _parameter});
    this.inputChange(e);
    this.request("getEmployeesList", (data)=>{
      this.setState({
        data: data.data.length ? data.data : ["noData"],
        pageInfo: data.pageinfo
      })
    });
    if(this.state.parameter.roleID === "-1"){
      return;
    }
    this.request("getLeader", (data) =>{
      let leader = [{value: "", text:"选择上级"}];
      leader.push.apply(leader,data);
      this.setState({
        leader: leader
      })
    })
  }

  someQuit(){
    let _state = this.state.operate;
    if(_state.click === "close"){
      _state.click = "click";
      _state.buttonName = "完成";
      _state.tip = "请选择离职人员";
      this.setState({
        operate: _state
      })
    }else{
      _state.click = "close";
      _state.buttonName = "批量离职";
      if(!this.state.parameter.empIdString){
        _state.tip = "没有任何人离职";
        this.setState({
          operate: _state
        });
        return;
      }
      this.request("dimission", (data)=>{
        if(data.error){
          _state.tip = <span className="wrong-color">{data.error}</span>;
          this.setState({
            operate: _state
          });
          return;
        }
        _state.tip = "离职完成";
        let _parameter = this.state.parameter;
        _parameter.empIdString = "";
        this.setState({
          parameter: _parameter,
          operate: _state
        });
        this.request("getEmployeesList", (data)=>{
          this.setState({
            data: data.data.length ? data.data : ["noData"],
            pageInfo: data.pageinfo
          })
        });
      })
    }
  }

  showModal(e){
    var _show,
      _id,
      _userName;
    if(e.target){
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
      this.request("getEmployeesList", (data)=>{
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

  /*行选中*/
  rowsOperation(e){
    let _thisRowId = e.currentTarget.getAttribute("data-id");
    let _empIdString = this.state.parameter.empIdString;
    let _positionString = _empIdString.indexOf(_thisRowId);
    let _parameter = this.state.parameter;
    if(_positionString === -1){
      _empIdString = _empIdString === "" ?  _thisRowId : _empIdString + ","+_thisRowId;
    }else{
      let _arrayString = _empIdString.split(",");
      _arrayString.splice(_arrayString.indexOf(_thisRowId), 1);
      _empIdString = _arrayString.join(",");
    }
    _parameter.empIdString = _empIdString;
    this.setState({
      parameter : _parameter
    })
  }

  contentModal(){
    switch (this.state.modal.name){
      case "AddEmployee":
        return <AddEmployee company={this.state.company} roleId={this.state.roleId} closeModal={this.showModal} />;
      case "EditorEmployee":
        return <EditorEmployee company={this.state.company} roleId={this.state.roleId} closeModal={this.showModal} empId={this.state.modal.id} />;
      case "QuitJob":
        return <QuitJob closeModal={this.showModal} empId={this.state.modal.id} name={this.state.modal.userName} />
    }
  }

  showList(){
    return (
      <div>
        {/*客户查询*/}
        <div className="selectCustomer">
          <p className="selectGroup">员工查询</p>
          <Input placeholder="员工手机号" operate={{onChange: this.inputSelect}} name="mobile"/>
          <Input placeholder="员工姓名" operate={{onChange: this.inputSelect}} name="empName"/>
          <Select option={this.state.company.slice(1)} operate={{onChange: this.allSelect}} name="company" tip="所属公司"
                  value={this.state.parameter.company}/>
          <Select option={this.state.roleId.slice(1)} name="roleID" operate={{onChange: this.leaderSelect}} tip="选择角色"
                  value={this.state.parameter.roleID}/>
          <Select option={this.state.leader} name="chief" operate={{onChange: this.inputSelect}} tip="选择上级"
                  value={this.state.parameter.chief}/>
        </div>
        {/*操作*/}
        <div className="selectCustomer">
          <p className="selectGroup">员工操作</p>
          <p className="selectGroup href-color" onClick={this.showModal} data-show={"AddEmployee"}>添加员工</p>
          <p className="selectGroup href-color" onClick={this.someQuit}>{this.state.operate.buttonName}</p>
          <span className="selectTip success-color">{this.state.operate.tip}</span>
        </div>
        <Table data={this.state.data} setting={this.state.setting} click={this.state.operate.click}
               empIdString={this.state.parameter.empIdString} rowsOperation={this.rowsOperation}/>
        { this.state.pageInfo.PageCount > 1 ?
          <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                      changeIndex={this.changeIndex}/> : "" }
      </div>)
  }

  render(){
    return (
      <IndexModule showInit={this.showList} id={this.props.params.id} isShowModal={this.state.modal.name} html={this.contentModal}/>
    )
  }
}

export default Employees;