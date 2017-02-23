/**
 * Created by Administrator on 2017/1/13.
 */
import React, { Component } from 'react'
import storage from './component/storageOperation';
import IndexModule from './module/index_module';
import { request , stop } from './component/request';
import {WelInit,Inside} from './module/welinit';
import {inputChange} from './component/formOperation';
import {} from "../css/index.css";
import {} from "../css/common.css";
import {} from "../css/screen.css";

class Welcome extends Component {
  constructor(props){
    super(props);
    const date = new Date();
    this.state = {
      parameter: {
        token: storage.getStorage().Token,
        empId: this.props.params.id === "10000" ? "null" : this.props.params.id,
        state: 0,
        startTime: date.getFullYear() + "." + parseInt(1 + date.getMonth()) + ".01",
        endTime: date.getFullYear() + "." + parseInt(1 + date.getMonth()) + "." + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()),
      },
      init: {},
      module: {},
      chiefName: {},
      percent: {},
      history: "has"
    };
    this.state.parameter.state =  location.pathname.indexOf("truth") === -1 ? 0 : 1;
    this.request = request.bind(this);
    this.showInit = this.showInit.bind(this);
    this.judgeRequest = this.judgeRequest.bind(this);
    this.showPercent = this.showPercent.bind(this);
    this.closePercent = this.closePercent.bind(this);
    this.switchControl = this.switchControl.bind(this);
    this.inputChange = inputChange.bind(this);
    if(this.props.params.id){
      this.state.history = "";
    }
    this.judgeRequest();
  }


  showPercent(e){
    let id = e.currentTarget.id;
    let key = e.currentTarget.getAttribute("data-key");
    let data = {
      token: this.state.parameter.token,
      empId: id
    };
    let percent = this.state.percent;
    let mod = this.state.module;
    let newMod = mod[this.state.parameter.empId][key];
    newMod.img = "open";
    mod[this.state.parameter.empId][key] = newMod;
    if(this.state.percent[id])
    {
      this.setState({
        module: mod
      });
      return;
    }

    this.request("getPercent", (data) => {
      percent[id] = data.data;
      this.setState({
        module: mod,
        percent: percent
      });
    },data);
  }

  closePercent(e){
    let key = e.currentTarget.getAttribute("data-key");
    let mod = this.state.module;
    let newMod = mod[this.state.parameter.empId][key];
    newMod.img = null;
    mod[this.state.parameter.empId][key] = newMod;
    this.setState({
      module: mod
    })
  }

  switchControl(e){
    let key = e.currentTarget.getAttribute("data-key");
    let mod =  this.state.module[this.state.parameter.empId][key];
    if(!mod.img){
      this.showPercent(e);
    }else{
      this.closePercent(e);
    }
  }

  judgeRequest(){
    let parameterId,
      chief,
      propsParamsId;
    parameterId = this.state.parameter.empId;
    propsParamsId = this.props.params.id;
    chief = this.state.chiefName;
    if(propsParamsId && propsParamsId !== "10000" && !chief[parameterId] ){
      this.request("getEmployee", (data)=>{
        chief[parameterId] = data.Name;
        this.setState({
          chiefName : chief
        });
      });
    }
    if (!propsParamsId){
      if(!this.state.init.length){
        this.request("getIndex", (data)=>{
          this.setState({
            init: data
          })
        })
      }
    } else {
      let mod = this.state.module;
      if(!mod[parameterId]){
        this.request("getState", (data)=>{
          mod[parameterId] = data.data;
          this.setState({
            module: mod
          })
        })
      }
    }
  }

  componentDidUpdate(nextProps, stateProps){
    if(this.props.params.id === nextProps.params.id){
      return;
    }
    stop("stop");
    let parameter = this.state.parameter;
    parameter.empId = this.props.params.id === "10000" ? "null" : this.props.params.id;
    this.setState({
      parameter : parameter
    });
    this.judgeRequest();
  }

  showInit(){
    let id = this.props.params.id;
    if (!id){
      return <WelInit data={this.state.init} inputChange={this.inputChange} boxValue={this.state.parameter.state}  state={this.state.parameter.state} />
    }
    return <Inside data={this.state.module[this.state.parameter.empId]} imgPercent={this.switchControl} state={this.state.parameter.state}
                  percent={this.state.percent} chiefName={this.state.chiefName[this.state.parameter.empId]} />
  }

  render(){
    return (
      <IndexModule showInit={this.showInit} id={this.props.params.id} history={this.state.history} />
    )
  }
}
export default Welcome;