/**
 * Created by Administrator on 2017/2/17.
 */
import React, { Component } from 'react'
import {} from '../../css/font/iconfont.css';
import {Close, Input, Select, Title, Tip} from '../component/form';
import { closeTip, inputChange, showTip, imageChange} from '../component/formOperation';
import { request } from '../component/request';
import storage from '../component/storageOperation';
import {} from '../../css/modal.css';
import {} from '../../css/common.css';
import {} from '../../css/login.css';

class ModalSection extends Component {
  render(){
    return (
      <div className="modal-bg table">
        <div className="va-middle">
          <div className="modal-main">
            {this.props.html()}
          </div>
        </div>
      </div>
    )
  }
}

class OperateEmployee extends Component {
  constructor(props){
    super(props);
    this.state = {
      parameter: {
        token: storage.getToken(),
        Token: storage.getToken(),
        Name: "",
        Mobile: "",
        Company: "",
        company: "",
        Role: "",
        Chief: "",
        roleID: "",
        empId: this.props.empId,
        empID: this.props.empId
      },
      leader: [],
      tip: {
        text: "",
        color: "wrong"
      },
      tipState: "hide"
    };
    this.closeTip = closeTip.bind(this);
    this.inputChange = inputChange.bind(this);
    this.leaderSelect = this.leaderSelect.bind(this);
    this.request = request.bind(this);
    this.action = this.action.bind(this);
    if (typeof this.props.getEmployee === "function"){
      this.getEmployee = this.props.getEmployee.bind(this);
      this.getEmployee();
    }
  }

  leaderSelect(e){
    this.inputChange(e);
    if (!this.state.parameter.roleID || !this.state.parameter.company){
      return;
    }
    this.request("getLeaderTrue", (data)=>{
      let _leader = [{value: "null", text: "没有上级"}];
      let _parameter = this.state.parameter;
      _parameter.Chief = "";
      this.setState({
        parameter: _parameter,
        leader: data ? data : _leader
      })
    })
  }

  action(e){
    e.preventDefault();
    let _parameter = this.state.parameter;
    _parameter.Company = _parameter.company;
    _parameter.Role = _parameter.roleID;
    this.setState({
      parameter: _parameter
    });
    if (_parameter.Role && _parameter.roleID && _parameter.Chief
      && _parameter.Mobile && _parameter.Name && _parameter.company !== ""){
      this.request(this.props.request, (data)=>{
        if (data.error){
          this.setState({
            tip: {
              text: data.error,
              color: "wrong"
            },
            tipState: "show"
          })
        }else{
          this.setState({
            tip: {
              text: this.props.title + "成功！",
              color: "success"
            },
            tipState: "show"
          })
        }
      });
    }else{
      this.setState({
        tip: {
          text: "请输入完整！",
          color: "wrong"
        },
        tipState: "show"
      })
    }
  }

  render(){
    return (
      <form className="form" onSubmit={this.action}>
        <Close onClick={this.props.closeModal}/>
        <Title title={this.props.title}/>
        <Tip color={this.state.tip.color} content={this.state.tip.text} closeTip={this.closeTip}
             tipState={this.state.tipState}/>
        <div className="row">
          <Input placeholder="员工姓名" operate={{onChange: this.inputChange}} value={this.state.parameter.Name} width="8"
                 name="Name" icon="&#xe60a;"/>
        </div>
        {
          this.props.request !== "editorEmployee" ?
            <div className="row">
              <Input placeholder="员工电话" operate={{onChange: this.inputChange}}
                     value={this.state.parameter.Mobile} width="8" name="Mobile" icon="&#xe601;"/>
            </div>
            : ""
        }
        <div className="row">
          <Select icon="&#xe606;" option={this.props.roleId.slice(1)} name="roleID" width="8"
                  operate={{onChange: this.leaderSelect}} tip="选择角色"
                  value={this.state.parameter.roleID}/>
        </div>
        <div className="row">
          <Select icon="&#xe60c;" option={this.props.company.slice(1)} width="8" operate={{onChange: this.leaderSelect}}
                  name="company" tip="所属公司"
                  value={this.state.parameter.company}/>
        </div>
        <div className="row">
          <Select icon="&#xe709;" option={this.state.leader} name="Chief" width="8"
                  operate={{onChange: this.inputChange}} tip="选择上级"
                  value={this.state.parameter.Chief}/>
        </div>
        <div className="row text-center">
          <Input type="submit" className="button-send cursor-pointer" width="8" value="提交"/>
        </div>
      </form>
    )
  }
}

class AddEmployee extends Component {
  render(){
    return <OperateEmployee{...this.props} title="添加员工" request="addEmployee"/>
  }
}

class EditorEmployee extends Component {
  getEmployee(){
    this.request("getEmployee", (data)=>{
      var _parameter = this.state.parameter;
      _parameter.Name = data.Name;
      _parameter.Chief = data.Chief;
      _parameter.company = data.Company;
      _parameter.roleID = data.Role;
      _parameter.Mobile = data.Mobile;
      this.setState({
        parameter: _parameter
      });
      this.request("getLeaderTrue", (data)=>{
        this.setState({
          leader: data
        })
      });
    });
  }

  render(){
    return <OperateEmployee {...this.props} title="修改员工资料" getEmployee={this.getEmployee} request="editorEmployee"/>
  }
}

class QuitJob extends Component {
  constructor(props){
    super(props);
    this.state = {
      parameter: {
        Token: storage.getToken(),
        empIdString: this.props.empId
      }
    };
    this.request = request.bind(this);
    this.action = this.action.bind(this);
  }

  action(e){
    e.preventDefault();
    this.request("dimission", ()=>{
      this.props.closeModal("yes");
    });
  }

  render(){
    return (
      <form className="form" onSubmit={this.action}>
        <Close onClick={this.props.closeModal}/>
        <Title title="离职"/>
        <div className="sureQuit">
          是否确认"<span className="success-color">{this.props.name}</span>"离职
        </div>
        <div className="row chose">
          <input type="submit" value="确认"/>
          <input type="button" onClick={this.props.closeModal} value="取消"/>
        </div>
      </form>
    )
  }
}

class ChangePersonnel extends Component {
  constructor(props){
    super(props);
    this.state = {
      parameter: {
        Token: storage.getToken(),
        token: storage.getToken(),
        empId: "",
        roleID: props.roleID ? props.roleID : "", // 10007
        company: "",
        customerId: this.props.empId
      },
      tip: {
        text: "",
        color: "wrong"
      },
      tipState: "hide",
      salesman: []
    };
    this.closeTip = closeTip.bind(this);
    this.action = this.props.action.bind(this);
    this.inputChange = inputChange.bind(this);
    this.leaderSelect = this.leaderSelect.bind(this);
    this.request = request.bind(this);
  }

  leaderSelect(e){
    this.inputChange(e);
    if (!this.state.parameter.roleID || !this.state.parameter.company){
      return;
    }
    this.request("getLeader", (data)=>{
      let _leader = [{value: "-1", text: "无"}];
      _leader.push.apply(_leader, data);
      this.setState({
        salesman: _leader
      })
    })
  }

  render(){
    return (
      <form className="form" onSubmit={this.action}>
        <Close onClick={this.props.closeModal}/>
        <Title title={this.props.title}/>
        <Tip color={this.state.tip.color} content={this.state.tip.text} closeTip={this.closeTip}
             tipState={this.state.tipState}/>
        <div className="nowPeople">
          当前业务人员：<span className="success-color">{this.props.name}</span>
        </div>
        <div className="row">
          <Select icon="&#xe60c;" option={this.props.company.slice(1)} width="8" operate={{onChange: this.leaderSelect}}
                  name="company" tip="所属公司"
                  value={this.state.parameter.company}/>
        </div>
        {
          !this.props.roleID ?
            <div className="row">
              <Select icon="&#xe606;" option={this.props.roleId.slice(1)} name="roleID" width="8"
                      operate={{onChange: this.leaderSelect}} tip="选择角色"
                      value={this.state.parameter.roleID}/>
            </div>
            : ""
        }
        <div className="row">
          <Select icon="&#xe60a;" option={this.state.salesman} name="empId" width="8"
                  operate={{onChange: this.inputChange}} tip="选择业务人员"
                  value={this.state.parameter.empId}/>
        </div>
        <div className="row text-center">
          <Input type="submit" className="button-send cursor-pointer" width="8" value="提交"/>
        </div>
      </form>
    )
  }
}

class EditorSalesman extends Component {
  action(e){
    e.preventDefault();
    if (this.state.parameter.empId){
      this.request("editorSalesman", (data)=>{
        if (data.error){
          this.setState({
            tip: {
              text: data.error,
              color: "wrong"
            },
            tipState: "show"
          })
        }else{
          this.setState({
            tip: {
              text: "修改成功！",
              color: "success"
            },
            tipState: "show"
          });
          this.props.closeModal("close");
        }
      })
    }else{
      this.setState({
        tip: {
          text: "请选择业务员！",
          color: "wrong"
        },
        tipState: "show"
      })
    }
  }

  render(){
    return <ChangePersonnel {...this.props} roleID="10007" action={this.action} title="修改业务员"/>
  }
}

class EditorRecommend extends Component {
  action(e){
    e.preventDefault();
    if (this.state.parameter.empId){
      this.request("editorRecommend", (data)=>{
        if (data.error){
          this.setState({
            tip: {
              text: data.error,
              color: "wrong"
            },
            tipState: "show"
          })
        }else{
          this.setState({
            tip: {
              text: "修改成功！",
              color: "success"
            },
            tipState: "show"
          });
          this.props.closeModal("close");
        }
      })
    }else{
      this.setState({
        tip: {
          text: "请选择推荐人！",
          color: "wrong"
        },
        tipState: "show"
      })
    }
  }

  render(){
    return <ChangePersonnel {...this.props} action={this.action} title="修改推荐人"/>
  }
}

class ChangePassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      parameter: {
        Token: storage.getToken(),
        mobile: storage.getStorage().Mobile,
        oldPassword: "",
        newPassword: "",
        MsgVCode: "",
        CheckCode: "",
        empId: storage.getStorage().ID
      },
      image: "/http/service/vcode?tip="+new Date().getTime(),
      send: "发送验证码",
      tip: {
        text: "",
        color: "wrong"
      },
      tipState: "hide"
    };
    this.closeTip = closeTip.bind(this);
    this.inputChange = inputChange.bind(this);
    this.request = request.bind(this);
    this.imageChange = imageChange.bind(this);
    this.timer = this.timer();
    this.timer = this.timer.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.action = this.action.bind(this);
  }

  timer(){
    var time = 1;
    return ()=>{
      setTimeout((()=>{
        if (time === 60){
          this.setState({
            send: "发送验证码"
          });
          time = 0;
          return;
        }
        this.setState({
          send: time
        });
        ++time;
        this.timer();
      }).bind(this), 1000);
    }
  }

  sendMessage(){
    if(!this.state.parameter.CheckCode){
      this.setState({
        tip: {
          text: "请输入完整内容",
          color: "wrong"
        },
        tipState: "show"
      });
      return;
    }
    if (typeof this.state.send === "number"){
      return;
    }
    this.request("sendMessage", (data)=>{
      if (data.error){
        this.setState({
          tip: {
            text: data.error,
            color: "wrong"
          },
          tipState: "show"
        });
        return;
      }
      this.setState({
        tip: {
          text: "短信发送成功，请查收",
          color: "success"
        },
        tipState: "show"
      });
      this.timer();
    });
  }

  action(e){
    e.preventDefault();
    if(!this.state.parameter.newPassword || !this.state.parameter.oldPassword || !this.state.parameter.MsgVCode){
      this.setState({
        tip: {
          text: "请输入完整内容",
          color: "wrong"
        },
        tipState: "show"
      });
      return;
    }
    this.request("changePassword", (data)=>{
      if (data.error){
        let _tip = this.state.tip;
        _tip.text = data.error;
        this.setState({
          tip: _tip,
          tipState: "show"
        });
        _tip = null;
        return;
      }
      this.setState({
        tip: {
          text: "密码修改成功！",
          color: "success"
        },
        tipState: "show"
      });
      this.props.closeModal();
    })
  }

  render(){
    return (
      <form className="form" onSubmit={this.action}>
        {this.props.noClose ? "" : <Close onClick={this.props.closeModal}/>}
        <Title title="修改密码"/>
        <Tip color={this.state.tip.color} content={this.state.tip.text} closeTip={this.closeTip}
             tipState={this.state.tipState}/>
        <div className="row">
          <Input placeholder="旧密码" type="password" operate={{onChange: this.inputChange}}
                 value={this.state.parameter.oldPassword} width="8"
                 name="oldPassword" icon="&#xe609;"/>
        </div>
        <div className="row">
          <Input placeholder="新密码" type="password" operate={{onChange: this.inputChange}}
                 value={this.state.parameter.newPassword} width="8"
                 name="newPassword" icon="&#xe609;"/>
        </div>
        <div className="row">
          <Input placeholder="验证码" operate={{onChange: this.inputChange}}
                 value={this.state.parameter.CheckCode} width="8" clickImage={this.imageChange}
                 name="CheckCode" icon="&#xe602;" imgSrc={this.state.image}/>
        </div>
        <div className="row">
          <Input placeholder="短信验证码" operate={{onChange: this.inputChange}} value={this.state.parameter.MsgVCode}
                 width="4" name="MsgVCode" icon="&#xe60b;" maxLength="4" />
          <Input type="button" className="a" operate={{onClick: this.sendMessage}} value={this.state.send} width="4"/>
        </div>
        <div className="row text-center">
          <Input type="submit" className="button-send cursor-pointer" width="8" value="提交"/>
        </div>
      </form>
    )
  }
}

export {
  ModalSection
  ,
  AddEmployee
  ,
  EditorEmployee
  ,
  QuitJob
  ,
  EditorSalesman
  ,
  EditorRecommend
  ,
  ChangePassword
}