/**
 * Created by Administrator on 2017/3/6.
 */
import React, { Component } from 'react';
import { Select , Checkbox} from './component/form';
import {inputChange} from './component/formOperation';
import { request } from './component/request';
import IndexModule from './module/index_module';
import {lineChart} from './component/chart';
import storage from './component/storageOperation';
import {} from "../css/index.css";
import {} from "../css/common.css";
import {} from "../css/screen.css";
import {} from "../css/chart.css";

class Count extends Component {
  constructor(props){
    super(props);
    this.state = {
      parameter: {
        token: storage.getToken(),
        findType: "",
        company: "",
        empId: "",
        role: "",
        leaderID: "",
        year: 2017
      },
      chartSetting: {
        currentClassName: "lineChart",
        lineClassName: "line",
        color: ['#A849AC', '#EA533F', '#1667A9', "#FFCD01", "#4CD990", "brown", "pink", "orange", "#000"]
      },
      roleList: [],
      yearList: [{Text: 2017, Value: 2017}],
      lineList: [],
      teamList: [],
      checkList: [],
      modeList: [],
      companyList: [],
      peopleList: [],
      update: ""
    };
    this.request = request.bind(this);
    this.request("getAuthority", ((data)=>{
      var _parameter = this.state.parameter;
      _parameter.findType = data.CompanyList[0].Value;
      var _checkList = this.state.checkList;
      data.CompanyList.map((line, key)=>{
        _checkList.push(key.toString());
      });
      this.setState({
        modeList: data.ModeList,
        companyList: data.CompanyList !== "null" ? data.CompanyList : [],
        parameter: _parameter,
        checkList: _checkList,
        update: "getMode&Company"
      });
    }).bind(this));
    this.countChart = this.countChart.bind(this);
    this.inputChange = inputChange.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.checkClick = this.checkClick.bind(this);
    this.lineChart = lineChart;
    this.getLineRequest = this.getLineRequest.bind(this);
    if (storage.getStorage().Role !== 10007){
      this.getRoleRequest();
    }
  }

  getLineRequest(){
    this.request("getLine", ((data)=>{
      let _checkList = [];
      data.map((line, key)=>{
        _checkList.push(key.toString());
      });
      this.setState({
        lineList: data,
        checkList: _checkList,
        update: "getLine"
      })
    }).bind(this));
  }

  getRoleRequest(){
    this.request("getChartRole", ((data)=>{
      this.setState({
        roleList: data,
        update: "getRole"
      })
    }).bind(this))
  }

  getTeam(){
    this.request("getTeam", ((data)=>{
      //let _checkList = [];
      let _empId = [];
      let _upDate = "getTeam";
      let _parameter = this.state.parameter;
      if (this.state.parameter.findType === "1"){
        data.map((line, key)=>{
          _empId.push(line.Value.toString());
          //_checkList.push(key.toString());
        });
        _upDate = "getMode&Company";
        _parameter.empId = _empId.join(",");
      }
      this.setState({
        teamList: data,
        update: _upDate
      })
    }).bind(this))
  }

  getPerson(){
    this.request("getPerson", ((data)=>{
      let _empId = [];
      let _parameter = this.state.parameter;
      data.map((data)=>{
        _empId.push(data.Value.toString());
      });
      _parameter.empId = _empId.join(",");
      this.setState({
        peopleList: data,
        parameter: _parameter,
        update: "getMode&Company"
      })
    }).bind(this))
  }

  componentDidUpdate(nextProps, nextState){
    //console.log(this.state);
    switch (this.state.update){
      case "getMode&Company":
      {
        this.getLineRequest();
        break;
      }
      case "getLine":
      {
        this.lineChart(this.state.chartSetting, this.state.lineList, this.state.checkList);
        this.setState({
          update: "getLineFinish"
        });
        break;
      }
      case "findType":
      {
        switch (this.state.parameter.findType){
          case "0":
          {
            this.setState({
              update: "getMode&Company"
            });
            break;
          }
          case "1":
          {
            if (this.state.parameter.role && this.state.parameter.company){
              this.getTeam();
            }
            break;
          }
          case "2":
          {
            if (this.state.parameter.role
              && this.state.parameter.leaderID
              && this.state.parameter.company){
              this.getTeam();
            }
            break;
          }
        }

        break;
      }
      case "role":
      case "company":
      {
        if (this.state.parameter.role && this.state.parameter.company){
          this.getTeam();
        }
        break;
      }
      case "leaderID":
      case "getTeam":
      {
        if (this.state.parameter.leaderID){
          this.getPerson();
        }
        break;
      }
    }
  }

  checkClick(e){
    let _element = e.currentTarget.getElementsByTagName("input")[0];
    let _val = _element.getAttribute("data-position");
    let _name = _element.name;
    let _checkboxList = this.state.checkList;
    let _pos = _checkboxList.indexOf(_val);
    let _update = "";
    if (_pos !== -1){
      _checkboxList.splice(_pos, 1);
      _update = "getLine";
    }else{
      _checkboxList.push(_val);
      _update = "getLine";
    }
    this.setState({
      checkList: _checkboxList,
      update: _update
    });
  }

  selectChange(e){
    this.inputChange(e);
    document.getElementsByClassName("lineChart")[0].innerHTML = "";
    let _parameter = this.state.parameter;
    let _people = this.state.peopleList;
    if (e.target.name === "findType" && e.target.value === "0"){
      _parameter.empId = "";
    }
    if (e.target.name !== "leaderID"){
      _parameter.leaderID = "";
      _people = [];
    }
    this.setState({
      update: e.target.name,
      peopleList: _people,
      parameter: _parameter
    })
  }

  countChart(){
    return (
      <div>
        <div className="selectCustomer">
          <Select option={this.state.yearList} name="year" operate={{onChange: this.selectChange}} tip="选择年份"
                  value={this.state.parameter.year}/>
          <Select option={this.state.modeList} name="findType" operate={{onChange: this.selectChange}} tip="选择筛选模式"
                  value={this.state.parameter.findType}/>
          {this.state.companyList.length && this.state.parameter.findType.toString() !== "0" ?
            <Select option={this.state.companyList} name="company" operate={{onChange: this.selectChange}} tip="选择公司"
                    value={this.state.parameter.company}/> : ""
          }
          {
            this.state.roleList.length && this.state.parameter.findType.toString() !== "0" ?
              <Select option={this.state.roleList} name="role" operate={{onChange: this.selectChange}} tip="选择角色"
                      value={this.state.parameter.role}/> : ""
          }
          {
            this.state.teamList.length && this.state.parameter.findType.toString() === "2" ?
              <Select option={this.state.teamList} name="leaderID" operate={{onChange: this.selectChange}} tip="请选择上级"
                      value={this.state.parameter.leaderID}/>
              : ""
          }
        </div>
        <div className="selectCustomer">
          {this.state.companyList.length && this.state.parameter.findType.toString() === "0" ?
            this.state.companyList.map(((line, key)=>{
              return <Checkbox list={this.state.checkList} value={line.Value} position={key}
                               color={this.state.chartSetting.color[key]} text={line.Text} onClick={this.checkClick}/>
            }).bind(this))
            : ""
          }
          {this.state.teamList.length && this.state.parameter.findType.toString() === "1" ?
            this.state.teamList.map(((line, key)=>{
              return <Checkbox list={this.state.checkList} value={line.Value} position={key}
                               color={this.state.chartSetting.color[key]} text={line.Text} onClick={this.checkClick}/>
            }).bind(this))
            : ""
          }
          {this.state.peopleList.length && this.state.parameter.findType.toString() === "2" ?
            this.state.peopleList.map(((line, key)=>{
              return <Checkbox list={this.state.checkList} value={line.Value} position={key}
                               color={this.state.chartSetting.color[key]} text={line.Text} onClick={this.checkClick}/>
            }).bind(this))
            : ""
          }
        </div>
        <div className="lineChart"></div>
      </div>)
  }

  render(){
    return <IndexModule showInit={this.countChart} id={this.props.params.id}/>
  }
}

export default Count;