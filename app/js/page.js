/**
 * Created by Administrator on 2016/10/27.
 */
(function ($, Form, PageNumber, Module, DateChose){
  var showData = [];
  var detailData;
  const EmployeeTable = React.createClass({
    getDefaultProps: function (){
      return {
        data: [{name: 1}, {name: 2}]
      }
    },
    getInitialState: function (){
      return {
        title: [],
        data: [],
        id: []
      }
    },
    componentWillMount: function (){
      let props = this.props;
      let title = [];
      for (let k in props.title){
        title.push(k);
      }
      this.setState({title: title});
    },
    render: function (){
      var props = this.props;
      var phone = "";
      return (
        <div className="table text-center list">
          <div className="row">
            {this.state.title.map(function (title, key){
              return <div className={"col phone-percent-"+
              props.tableStyle[key].phone*10 +" percent-"+props.tableStyle[key].pc*10+" "+phone }>{props.title[title]}</div>
            }.bind(this))}
          </div>
          {props.data.map(function (row){
            return <EmployeeRow rowData={row} tableStyle={props.tableStyle} rowClick={this.props.rowClick}
                                rowOption={props.rowOption} rowMark={props.rowMark} option={this.props.option}
                                parameterId={this.props.parameterId} title={this.state.title}/>
          }.bind(this))}
        </div>
      )
    }
  });
  const EmployeeRow = React.createClass({
    getDefaultProps: function (){
      return {
        rowClick: []
      }
    },
    choseRow: function (e){
      if (!e.currentTarget.getAttribute("data-mark") || e.currentTarget.getAttribute("data-mark") === "false"){
        return;
      }
      var id = e.currentTarget.getAttribute("data-id");
      this.props.rowOption(id);
    },
    render: function (){
      var props = this.props;
      var belong = props.rowData[props.parameterId] ? props.rowClick.indexOf(props.rowData[props.parameterId].toString()) : -1;
      return (
        <div className={(belong !== -1) ? "row clicked" : "row"}
             data-id={props.rowData.Id} onClick={this.choseRow} data-mark={props.rowMark}>
          {props.title.map(function (cols, key){
            if (props.option && key === props.title.length - 1){
              return;
            }
            let tableStyle = props.tableStyle[key];
            let color = typeof tableStyle.color === "string" ? tableStyle.color : "";
            let judgeParameter = tableStyle.judgeParameter;
            let judgeResult = tableStyle.judgeResult;
            let judgeName = props.rowData[cols];
            //判断属性显示
            if (props.rowData[judgeParameter] && props.rowData[judgeParameter] === judgeResult){
              judgeName = tableStyle.judgeName ? tableStyle.judgeName.t : judgeName;
              color = tableStyle.color.t ? tableStyle.color.t : "";
            }else if (props.rowData[judgeParameter]){
              judgeName = tableStyle.judgeName ? tableStyle.judgeName.f : judgeName;
              color = tableStyle.color.f ? tableStyle.color.f : "";
            }
            //
            judgeName = tableStyle.format ? tableStyle.format(judgeName) : judgeName;
            return (
              <div className={"col table-content phone-percent-"+
              props.tableStyle[key].phone*10 +" percent-"+props.tableStyle[key].pc*10+" "+color}>{judgeName}</div>
            )
          })}
          {
            props.option ?
              <div className={"option col phone-percent-"+props.tableStyle[props.tableStyle.length-1].phone*10
             +" percent-"+ props.tableStyle[props.tableStyle.length-1].pc*10 +" table-content clear-both"}>
                {
                  props.option.map(function (cols, key){
                    let len = this.props.option.length;
                    let json = {};
                    for (let k in cols.activeAttr){
                      json[k] = this.props.rowData[cols.activeAttr[k]];
                    }
                    let optionJudge = props.option[key].judge;
                    return (
                      !optionJudge || optionJudge.result === props.rowData[optionJudge.name]
                        ?
                        <a className={"href-color block-"+len} data-name={cols.name} {...json} {...cols.attr}>
                          {cols.chinaName}
                        </a>
                        :
                        optionJudge.ifFalse
                    )
                  }.bind(this))
                }
              </div>
              : ""
          }
        </div>
      )
    }
  });
  const ShowEmployee = React.createClass({
    getInitialState: function (){
      return {
        parameter: {
          empId: "",
          Token: "",
          roleId: "",
          mobile: "",
          empName: "",
          chief: "",
          company: -1,
          pageIndex: 1,
          pageSize: 15
        },
        data: [],
        pageInfo: "",
        quitId: [],
        tip: "",
        quit: "批量离职",
        startQuit: false
      }
    },
    setParameter: function (parameter){
      var par = this.state.parameter;
      par.mobile = parameter.mobile;
      par.empName = parameter.empName;
      par.pageIndex = 1;
      par.chief = parameter.chief === "null" ? "" : parameter.chief;
      par.company = parameter.company ? parameter.company : -1;
      this.setState({
        parameter: {
          ...par
        }
      });
    },
    request: function (parameter){
      $.ajax({
        url: "/api/Employees/GetEmployeesList",
        type: "get",
        data: parameter,
        success: function (data){
          this.setState({
            data: data.data,
            pageInfo: data.pageinfo,
            parameter: parameter
          });
        }.bind(this),
        error: function (data){
          this.props.clearData();
        }.bind(this)
      });
    },
    componentWillMount: function (){
      var props = this.props;
      this.state.parameter.empId = props.ID;
      this.state.parameter.roleId = props.Role;
      this.state.parameter.Token = props.Token;
      this.request(this.state.parameter);
    },
    componentDidMount: function (){
      var page = document.getElementById("page");
      if (page.clientWidth < 870){
        return;
      }
      page.style.width = page.clientWidth - 50 + "px";
    },
    componentDidUpdate: function (nextProps, nextState){
      if (this.state.parameter !== nextState.parameter || this.props.postData === "refresh"){
        this.props.postData = "";
        this.request(this.state.parameter);
      }
    },
    changeIndex: function (index){
      this.state.parameter.pageIndex = index;
      $(window).scrollTop(0);
      this.request(this.state.parameter);
    },
    changePage: function (e){
      var dataId = {};
      if (e.target.getAttribute("data-userName")){
        dataId.userId = e.target.getAttribute("data-id");
        dataId.userName = e.target.getAttribute("data-userName");
      }else{
        dataId = e.target.getAttribute("data-id");
      }
      var name = e.target.getAttribute("data-name");
      if (dataId){
        this.props.setShow({
          show: name,
          postData: dataId
        });
        return;
      }
      this.props.setShow(name);
    },
    quitPeople: function (e){
      var array = this.state.quitId;
      if (array.indexOf(e) !== -1){
        array.splice(array.indexOf(e), 1);
      }else{
        array.push(e);
      }
      this.setState({quitId: array});
    },
    beginQuit: function (e){
      if (!this.state.startQuit){
        this.setState({
          tip: "请选择离职员工",
          startQuit: true,
          quit: "完成"
        });
      }else{
        if (!this.state.quitId[0]){
          this.setState({
            tip: "任何人没有离职",
            startQuit: false,
            quit: "批量离职"
          });
          return;
        }
        var id = this.state.quitId;
        this.setState({quitId: []});
        $.ajax({
          url: "/api/Employees/BatchOperationDimission",
          type: "post",
          data: {
            Token: this.props.Token,
            empId: id.toString()
          },
          success: function (data){
            if (data.error){
              this.setState({
                tip: data.error,
                startQuit: false,
                quit: "批量离职"
              });
              return;
            }
            this.setState({
              tip: "员工离职完成",
              startQuit: false,
              quit: "批量离职"
            });
            this.props.setShow({show: this.props.hidden, postData: "refresh"})
          }.bind(this),
          error: function (data){
            this.props.clearData();
          }.bind(this)
        });
      }
    },
    render: function (){
      let title = {
        Name: "姓名",
        Mobile: "手机号",
        ChiefName: "上级",
        RoleName: "角色",
        IsDismision: "是否离职",
        CompanyName: "公司",
        option: "操作"
      };
      let tableStyle = [
        {
          pc: 2,
          phone: 2
        }, {
          pc: 2,
          phone: 3
        },
        {
          pc: 1,
          phone: 0
        },{
          pc: 1,
          phone: 1.5
        }, {
          pc: 1,
          phone: 0,
          judgeParameter: "IsDismision",
          judgeResult: "否",
          color: {
            t: "success-color",
            f: "wrong-color"
          }
        }, {
          pc: 1,
          phone: 1
        }, {
          pc: 1.5,
          phone: 2.5
        }];
      let option = [
        {
          chinaName: "离职",
          name: "quit",
          attr: {
            "onClick": this.changePage
          },
          activeAttr: {
            "data-id": "Id",
            "data-username": "Name"
          }
        },
        {
          chinaName: "修改",
          name: "editorUser",
          attr: {
            "onClick": this.changePage
          },
          activeAttr: {
            "data-id": "Id"
          }
        }
      ];
      let array = this.state.data;
      return (
        <div className="page" id="page">
          <EmployeeSearch userData={this.props} setParameter={this.setParameter} clearData={this.props.clearData}/>
          <div className="selection option">
            <div className="row block-2-10 phone-block-4">
              <a className="href-color" title="点击添加人员" data-name="addUser" onClick={this.changePage}>添加成员</a>
            </div>
            <div className="row block-2-10 phone-block-4">
              <a className="href-color" title={"点击"+this.state.quit} onClick={this.beginQuit}>{this.state.quit}</a>
            </div>
            <span className="tip success-color row block-2-80 phone-block-2">{this.state.tip}</span>
          </div>
          <EmployeeTable title={title} data={array} tableStyle={tableStyle} rowClick={this.state.quitId}
                         rowOption={this.quitPeople} option={option} rowMark={this.state.startQuit}
                         parameterId="Id"/>
          {this.state.pageInfo.PageCount !== 1 && this.state.pageInfo.PageCount
            ? <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                          pageSize={this.state.parameter.pageSize} changeIndex={this.changeIndex}/>
            : "" }
        </div>
      )
    }
  });
  const ShowCustomer = React.createClass({
    getInitialState: function (){
      return {
        parameter: {
          Token: this.props.Token,
          loginEmpId: this.props.ID,
          leaderEmpId: 0,
          lendState: -1,
          pageIndex: 1,
          pageSize: 15,
          customerName: "",
          customerMobile: "",
          company: -1,
          customerState: -1
        },
        data: [],
        pageInfo: ""
      }
    },
    setParameter: function (parameter){
      var meter = this.state.parameter;
      meter.company = parameter.company ? parameter.company : -1;
      meter.customerName = parameter.customerName.trim();
      meter.customerMobile = parameter.customerMobile.trim();
      meter.customerState = parameter.customerState ? parameter.customerState : -1;
      meter.lendState = parameter.lendState ? parameter.lendState : -1;
      meter.leaderEmpId = parameter.leaderEmpId ? parameter.leaderEmpId : 0;
      meter.pageIndex = 1;
      this.setState({parameter: meter});
      this.request();
    },
    componentWillMount: function (){
      this.request();
    },
    componentDidMount: function (){
      var page = document.getElementById("page");
      if (page.clientWidth < 870){
        return;
      }
      page.style.width = page.clientWidth - 50 + "px";
    },
    componentDidUpdate: function (){
      if (this.props.postData === "refresh"){
        this.props.postData = "";
        this.request();
      }
    },
    changeIndex: function (index){
      var meter = this.state.parameter;
      meter.pageIndex = index;
      $(window).scrollTop(0);
      this.setState({parameter: meter});
      this.request();
    },
    changePage: function (e){
      var dataId = {};
      dataId.userId = e.target.getAttribute("data-id");
      dataId.userName = e.target.getAttribute("data-username");
      var name = e.target.getAttribute("data-name");
      if (dataId){
        this.props.setShow({
          show: name,
          postData: dataId
        });
        return;
      }
      this.props.setShow(name);
    },
    choPage: function (e){
      this.props.setHistory(e.target.getAttribute("data-page"));
      this.props.chosePage(e);
    },
    request: function (){
      var parameter = this.state.parameter;
      $.ajax({
        url: "/api/Customer/GetCustomerList",
        type: "get",
        data: parameter,
        success: function (data){
          if(this.props.Role <= 10001){
            data.data.map(function(dat){
              dat.AlotEmpName = <a className="href-color" data-name="editorEmpName" data-id={dat.ID} data-userName={dat.AlotEmpName} onClick={this.changePage}>{dat.AlotEmpName}</a>
              dat.EmpName = <a className="href-color" data-name="editorReferee" data-id={dat.ID} data-userName={dat.EmpName} onClick={this.changePage}>{dat.EmpName}</a>
            }.bind(this));
          }
          this.setState({
            data: data.data,
            pageInfo: data.pageinfo
          });
        }.bind(this),
        error: function (data){
          this.props.clearData();
        }.bind(this)
      });
    },
    render: function (){
      var title = {
        CustomerName: "客户姓名",
        Mobile: "手机号",
        RgTime: "注册时间",
        State: "是否认证",
        AlotEmpName: "业务人员",
        EmpName: "推荐人",
        Option: "投资明细"
      };
      var tableStyle = [
        {
          pc: 1,
          phone: 2
        }, {
          pc: 2,
          phone: 3
        }, {
          pc: 1.5,
          phone: 0
        }, {
          pc: 1,
          phone: 1.5,
          judgeParameter: "CustomerName",
          judgeResult: "无",
          judgeName: {
            t: "未实名",
            f: "已实名"
          },
          color: {
            t: "wrong-color",
            f: "success-color"
          }
        },{
          pc: 1,
          phone: 0
        }, {
          pc: 1,
          phone: 1.5
        }, {
          pc: 1.5,
          phone: 2
        }
      ];
      var option = [
        {
          judge: {
            name: "IsLend",
            result: 1,
            ifFalse: "没有记录显示"
          },
          chinaName: "显示",
          name: "showDetail",
          activeAttr: {
            "data-id": "ID",
            "data-username": "CustomerName"
          },
          attr: {
            "onClick": this.choPage,
            "data-page": "showDetail"
          }
        }
      ];
      return (
        <div className="page" id="page">
          <CustomerSearch setParameter={this.setParameter} id={this.props.ID} token={this.props.Token}/>
          <EmployeeTable title={title} tableStyle={tableStyle} changePage={this.props.changePage}
                         option={option} parameterId="ID"
                         chosePage={this.choPage} data={this.state.data}/>
          {this.state.pageInfo.PageCount !== 1 && this.state.pageInfo.PageCount
            ? <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                          pageSize={this.state.parameter.pageSize} changeIndex={this.changeIndex}/>
            : ""}
        </div>
      )
    }
  });
  const ShowDetail = React.createClass({
    getInitialState: function (){
      return {
        parameter: {
          Token: this.props.Token,
          customerId: this.props.customerId,
          pageSize: 10,
          pageIndex: 1,
          contractType: -1
        },
        data: [],
        pageInfo: ""
      }
    },
    setParameter: function (data){
      'use strict';
      let parameter = this.state.parameter;
      parameter.contractType = data.contractType;
      parameter.pageIndex = 1;
      this.setState({parameter: parameter});
      this.request();
    },
    componentWillMount: function (){
      'use strict';
      this.request();
    },
    changeIndex: function (index){
      'use strict';
      let parameter = this.state.parameter;
      parameter.pageIndex = index;
      this.setState({parameter: parameter});
      this.request();
    },
    request: function (){
      'use strict';
      let parameter = this.state.parameter;
      $.ajax({
        url: "/api/Customer/GetCustomerLendList",
        data: parameter,
        success: function (data){
          if (data.error){
            return;
          }
          this.setState({
            data: data.data,
            pageInfo: data.pageinfo
          });
        }.bind(this),
        error: function (){
          this.props.clearData();
        }.bind(this)
      })
    },
    render: function (){
      'use strict';
      var title = {
        ContractMoney: "金额",
        ContractName: "投资名称",
        Cycle: "投资周期",
        Rate: "年化率",
        St: "开始时间",
        Et: "结束时间"
      };
      var tableStyle = [
        {
          pc: 2,
          phone: 2
        }, {
          pc: 2,
          phone: 2.5
        }, {
          pc: 1.5,
          phone: 2
        }, {
          pc: 1,
          phone: 1
        }, {
          pc: 1.5,
          phone: 0
        }, {
          pc: 1.5,
          phone: 2.5
        }
      ];
      return (
        <div className="page" id="page">
          <DetailSearch setParameter={this.setParameter} token={this.props.Token}/>
          <div className="menu">
            <p className="text-center">"<span className="success-color">{this.props.name}</span>"的投资明细</p>
          </div>
          <EmployeeTable title={title} tableStyle={tableStyle} parameterId="ContractNo" data={this.state.data}/>
          {this.state.pageInfo.PageCount !== 1 && this.state.pageInfo.PageCount
            ? <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                          pageSize={this.state.parameter.pageSize} changeIndex={this.changeIndex}/>
            : "" }
        </div>
      )
    }
  });
  const CustomerSearch = React.createClass({
    getInitialState: function (){
      return {
        input: {
          customerMobile: "",
          customerName: ""
        },
        selectRole: {
          roleId: ""
        },
        lendState: {
          selectName: "lendState",
          selectChinaName: "客户投资",
          option: [
            {Text: "未选择", Value: "-1"},
            {Text: "没有投资记录", Value: "0"},
            {Text: "有投资记录", Value: "1"}
          ]
        },
        company: {
          selectName: "company",
          selectChinaName: "公司",
          option: [
            {Text: "无", Value: "-1"},
            {Text: "园区", Value: "0"},
            {Text: "吴中", Value: "1"},
            {Text: "湖西", Value: "2"},
            {Text: "吴中二部", Value: "3"}
          ]
        },
        customerState: {
          selectName: "customerState",
          selectChinaName: "客户状态",
          option: [
            {Text: "未选择", Value: "-1"},
            {Text: "未实名", Value: "0"},
            {Text: "无客户经理", Value: "1"}
          ]
        },
        roleList: {
          "selectName": "roleId",
          selectChinaName: "角色",
          option: [
            {Text: "无", Value: "0"}
          ]
        },
        roleName: {
          selectName: "roleName",
          selectChinaName: "推荐人",
          option: [
            {Text: "请先选定角色", Value: ""}
          ]
        }
      }

    },
    timeTrigger: function (){
      this.props.setParameter(this.state.input);
    },
    setTime: function (){
      var time;
      return function (){
        if (typeof time === "number"){
          clearTimeout(time);
        }
        time = setTimeout(function (){
          this.timeTrigger();
        }.bind(this), 500)
      }
    }(),
    componentWillMount: function (){
      var parameter = {
        empID: this.props.id,
        token: this.props.token
      };
      $.ajax({
        url: "/api/Employees/GetRole",
        type: "get",
        data: parameter,
        dataType: "json",
        success: function (data){
          if (data === "null"){
            return;
          }
          if (data.error){
            alert(data.error);
            return;
          }
          data.unshift({Text: "无", Value: ""});
          var option = this.state.roleList;
          option.option = data;
          this.setState({roleList: option});
        }.bind(this),
        error: function (xhr, status, err){
          this.props.clearData();
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    onChange: function (e){
      var json = this.state.input;
      var name = e.target.name;
      json[name] = e.target.value;
      this.setState({input: json});
      this.setTime();
    },
    selectOnChange: function (e){
      var json = this.state.input;
      var name = e.target.name;
      json[name] = e.target.value;
      this.setState({input: json});
      if (name === "company"){
        this.requestRoleName();
        json.leaderEmpId = "";
        this.setState({
          input: json
        });
      }
      this.timeTrigger();
    },
    selectRoleName: function (e){
      var roleId = this.state.selectRole;
      roleId.roleId = e.target.value;
      this.setState({
        selectRole: roleId
      });
      this.requestRoleName();
    },
    requestRoleName: function (){
      var company = this.state.input.company ? this.state.input.company : -1;
      if (!this.state.selectRole.roleId){
        return;
      }
      var roleName = this.state.selectRole.roleId;
      $.ajax({
        url: "/api/Employees/GetLeaderByCustomer",
        data: {
          roleID: roleName,
          company: company,
          token: this.props.token
        },
        success: function (data){
          if (data === "null"){
            return;
          }
          if (data.error){
            alert(data.error);
            return;
          }
          data.unshift({Text: "无", Value: "0"});
          var option = this.state.roleName;
          option.option = data;
          this.setState({roleName: option});
        }.bind(this),
        error: function (xhr, status, err){
          this.props.clearData();
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
    },
    render: function (){
      var Input = Form.input;
      var Select = Form.select;
      return (
        <div className="selection clear-both">
          <div className="block-2-15 phone-block-2-40">
            <Input type="text" value={this.state.input.customerMobile} onChange={this.onChange} name="customerMobile"
                   tips="请输入手机号"/>
          </div>
          <div className="block-2-15 phone-block-2-40">
            <Input type="text" value={this.state.input.customerName} onChange={this.onChange} name="customerName"
                   tips="请输入姓名"/>
          </div>
          <div className="block-2-15 phone-block-2-30">
            <Select {...this.state.lendState} name="lendState" onChange={this.selectOnChange}/>
          </div>
          <div className="block-2-15 phone-block-2-40">
            <Select {...this.state.customerState} name="customerState" onChange={this.selectOnChange}/>
          </div>
          <div className="block-2-15 phone-block-2-30">
            <Select {...this.state.company} name="company" onChange={this.selectOnChange}/>
          </div>
          <div className="block-2-15 phone-block-2-30">
            <Select {...this.state.roleList} name="roleId" onChange={this.selectRoleName}/>
          </div>
          <div className="block-2-15 phone-block-2-30">
            <Select {...this.state.roleName} name="leaderEmpId" data={this.state.input.leaderEmpId}
                                             onChange={this.selectOnChange}/>
          </div>
          <div className="loading block-2-15 phone-block-2-30">

          </div>
        </div>
      )
    }
  });
  const EmployeeSearch = React.createClass({
    getInitialState: function (){
      return {
        input: {
          mobile: "",
          empName: "",
          chief: "",
          role: ""
        },
        roleList: {
          selectName: "Role",
          selectChinaName: "角色",
          option: [
            {Text: "无", Value: ""}
          ]
        },
        companyList: {
          selectName: "Company",
          selectChinaName: "公司",
          option: [
            {Text: "无", Value: "-1"},
            {Text: "园区", Value: "0"},
            {Text: "吴中", Value: "1"},
            {Text: "湖西", Value: "2"},
            {Text: "吴中二部", Value: "3"}
          ]
        },
        chiefList: {
          selectName: "Chief",
          selectChinaName: "所属上级",
          option: [
            {Text: "无", Value: ""}
          ]
        }
      }
    },
    timeTrigger: function (){
      this.props.setParameter(this.state.input);
    },
    setTime: function (){
      var time;
      return function (){
        if (typeof time === "number"){
          clearTimeout(time);
        }
        time = setTimeout(function (){
          this.timeTrigger();
        }.bind(this), 500)
      }
    }(),
    componentWillMount: function (){
      var parameter = {
        empID: this.props.userData.ID,
        token: this.props.userData.Token
      };
      $.ajax({
        url: "/api/Employees/GetRole",
        type: "get",
        data: parameter,
        dataType: "json",
        success: function (data){
          if (data === "null"){
            return;
          }
          if (data.error){
            alert(data.error);
            return;
          }
          data.unshift({Text: "无", Value: ""});
          var option = this.state.roleList;
          option.option = data;
          this.setState({roleList: option});
        }.bind(this),
        error: function (xhr, status, err){
          this.props.clearData();
          //console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    getLeader: function (roleID, company){
      var parameter = {
        roleID: roleID,
        company: company,
        token: this.props.userData.Token
      };
      $.ajax({
        url: "/api/Employees/GetLeaderByCustomer",
        type: "get",
        data: parameter,
        dataType: "json",
        success: function (data){
          if (data === null){
            return;
          }
          if (data.error){
            alert(data.error);
            return;
          }
          if (data !== "null"){
            data.unshift({Text: "无", Value: ""});
            var option = this.state.chiefList;
            var input = this.state.input;
            input.chief = "null";
            this.setState({input: input});
            input = null;
            option.option = data;
          }
          this.setState(option);
        }.bind(this),
        error: function (xhr, status, err){
          this.props.clearData();
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    onChange: function (e){
      var json = this.state.input;
      var name = e.target.name;
      json[name] = e.target.value;
      this.setState({input: json});
      this.setTime();
    },
    selectOnChange: function (e){
      var json = this.state.input;
      var name = e.target.name;
      json[name] = e.target.value;
      if (name === "role"){
        json["chief"] = "";
      }
      this.setState({input: json});
      if (json.role){
        json.company = json.company || json.company === "0" ? json.company : "-1";
        this.getLeader(json.role, json.company);
      }
      this.setTime();
    },
    render: function (){
      var Input = Form.input;
      var Select = Form.select;
      return (
        <div className="selection clear-both">
          <div className="block-2-15 phone-block-2-40">
            <Input type="text" value={this.state.input.mobile} onChange={this.onChange} name="mobile" tips="请输入手机号"/>
          </div>
          <div className="block-2-15 phone-block-2-40">
            <Input type="text" value={this.state.input.name} name="empName" onChange={this.onChange} tips="请输入姓名"/>
          </div>
          <div className="block-2-15 phone-block-2-30">
            <Select {...this.state.roleList} name="role" onChange={this.selectOnChange}/>
          </div>
          <div className="block-2-15 phone-block-2-30">
            <Select {...this.state.companyList} name="company" onChange={this.selectOnChange}/>
          </div>
          <div className="block-2-15 phone-block-2-40">
            <Select {...this.state.chiefList} name="chief" data={this.state.input.chief} onChange={this.onChange}/>
          </div>
        </div>
      )
    }
  });
  const DetailSearch = React.createClass({
    getInitialState: function (){
      return {
        contractList: {
          selectName: "contract",
          selectChinaName: "合同类型",
          option: [
            {Text: "无", Value: "-1"}
          ]
        }
      }
    },
    componentWillMount: function (){
      'use strict';
      $.ajax({
        url: "/api/Customer/GetCustomerLendSelectList",
        data: {
          Token: this.props.token
        },
        success: function (data){
          if (data.error){
            return;
          }
          let contractList = this.state.contractList;
          contractList.option = data.data;
          contractList.option.unshift({Text: "无", Value: "-1"});
          this.setState({contractList: contractList});
        }.bind(this),
        error: function (data){
          this.props.clearData();
        }.bind(this)
      });
    },
    selectOnChange: function (e){
      'use strict';
      var json = {};
      let name = e.target.name;
      json[name] = e.target.value;
      this.props.setParameter(json);
    },
    render: function (){
      let Select = Form.select;
      return (
        <div className="selection clear-both">
          <div className="block-2-15 phone-block-2-30">
            <Select {...this.state.contractList} name="contractType" onChange={this.selectOnChange}/>
          </div>
        </div>
      )
    }
  });
  const Welcome = React.createClass({
    getInitialState: function (){
      let date = new Date();
      return ({
        data: [],
        url: "/api/Home/Index",
        parameter: {
          token: this.props.Token,
          empId: this.props.empId ? this.props.empId : "",
          startTime: date.getFullYear()+"."+ parseInt( 1+ date.getMonth()) +".01",
          endTime: date.getFullYear()+"."+ parseInt( 1 + date.getMonth()) +"."+(date.getDate() < 10 ? "0"+date.getDate() : date.getDate())
        },
        dataTable: {
          title: {
            UserName: "用户名",
            Money: "投资金额",
            StartTime: "开始日期",
            EndTime: "结束日期",
            EmpName: "业务员"
          },
          parameter: {
            pageIndex: 1,
            pageSize: 10
          },
          tableStyle: [
            {
              pc: 2,
              phone: 1.5
            }, {
              pc: 3,
              phone: 3
            }, {
              pc: 2,
              phone: 2,
              format: function (e){
                let array,
                  string;
                array = e.split("T")[0];
                //string = array[1] + "-" +array[2];
                return array;
              }
            }, {
              pc: 2,
              phone: 2,
              format: function (e){
                if (!e){
                  return "null";
                }else{
                  let array,
                    string;
                  array = e.split("T")[0];
                  //string = array[1] + "-" + array[2];
                  return array;
                }
              }
            }, {
              pc: 1,
              phone: 1.5
            }
          ],
          detailData: [],
          pageInfo: {}
        },
        newLendTable: {
          title: {
            ContractMoney: "金额",
            ContractName: "投资名称",
            CustomerName: "客户名",
            Cycle: "投资周期",
            Rate: "年化率",
            St: "开始时间",
            Et: "结束时间"
          },
          parameter: {
            token: this.props.Token,
            pageIndex: 1,
            pageSize: 10
          },
          tableStyle: [
            {
              pc: 2,
              phone: 2
            }, {
              pc: 2,
              phone: 2.5
            },{
              pc: 1,
              phone: 1.5
            },{
              pc: 1.5,
              phone: 2
            }, {
              pc: 1,
              phone: 1.5
            }, {
              pc: 1.5,
              phone: 0,
              format: function(e){
                if(!e){
                  return "null";
                }
                let array,
                  string;
                array = e.split("-");
                string = array[1]+"-"+array[2];
                return string
              }
            }, {
              pc: 1,
              phone: 0,
              format: function(e){
                if(!e){
                  return "null";
                }
                let array,
                  string;
                array = e.split("-");
                string = array[1]+"-"+array[2];
                return string
              }
            }
          ],
          detailData: [],
          pageInfo: {}
        },
        dateShow: {
          state: "hidden",
          endOrStart: ""
        }
      })
    },
    clicked: false,
    load: "正在读取数据.....",
    /**
     * 初始化
     * @params data property -->> json
     * */
    init: function(data){
      let array;
      let date = new Date();
      array = [{
        name: "detail",
        company: [
          <p>
            入金总额<br />
          </p>
        ],
        data: {
          content: [data.totalmoney],
          type: 'string'
        },
        count: [
          <p className="module-spe-style text-right">
            统计周期：<a onClick={this.showDate} data-name="startTime" className="href-color">{this.state.parameter.startTime}</a>
            ---
            <a onClick={this.showDate} data-name="endTime" className="href-color">{this.state.parameter.endTime}</a>
          </p>
        ]
      }];
      if (this.props.GroupID > 10001){
        array.push({
          name: "expireLend",
          company: ["本月即将到期客户(人)"],
          data: {
            content: [data.expireLend.count]
          },
          count: [
            <p className="module-spe-style text-right">
              时间：{date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
            </p>
          ]
        });
      }
      else{
        array.push({
          name: "list",
          company: ["业绩审批列表"],
          data: {
            content: ["点击查看"]
          },
          count: [
            <p className="module-spe-style text-right">
              时间：{date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
            </p>
          ]
        })
      }
      array.push({
        name: "newLend",
        company: ["我的最新投资"],
        data: {
          content: ["点击查看"]
        },
        count: [
          <p className="module-spe-style text-right">
            时间：{date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
          </p>
        ]
      });
      showData[0] = array;
      detailData = data.expireLend.data;
      this.setState({
        data: array
      });
    },
    componentWillMount: function (){
      showData = [];
      this.request(function (data){
        this.init(data);
      }.bind(this));
    },
    role: {
      10003: "营业部",
      10004: "团队",
      10005: "团队",
      10006: "小组",
      10007: "个人"
    },
    image: [
      "img/iconcrown/crown_first.png",
      "img/iconcrown/crown_second.png",
      "img/iconcrown/crown_third.png"
    ],
    /**
     * 请求生成饼状图数据
     * */
    showDetail: function (e){
      let id = e.currentTarget.getAttribute("data-id");
      let key = e.currentTarget.getAttribute("data-key");
      let data = showData[this.props.name];
      data[key].showImg = data[key].showImg ? false : true;
      if (data[key].showImg){
        $.ajax({
          url: "/api/Home/GetPercent",
          data: {
            token: this.props.Token,
            empId: id
          },
          success: function (e){
            let array = [];
            for (var k in e.data){
              array.push(e.data[k] + "%");
            }
            data[key].img = [
              <div className="clear-both canvasImage">
                <canvas className="canvas" width="195" height="195" data-percent={array.join(",")}>1</canvas>
                <div className="clear-both pieWord">
                  <div className="block-1"><i></i>01月:<span>{array[4] === "null%" ? "0%" : array[4]}</span></div>
                  <div className="block-1"><i></i>03月:<span>{array[3] === "null%" ? "0%" : array[3]}</span></div>
                  <div className="block-1"><i></i>06月:<span>{array[2] === "null%" ? "0%" : array[2]}</span></div>
                  <div className="block-1"><i></i>12月:<span>{array[1] === "null%" ? "0%" : array[1]}</span></div>
                  <div className="block-1"><i></i>24月:<span>{array[0] === "null%" ? "0%" : array[0]}</span></div>
                </div>
              </div>];
            this.setState({data: data});
          }.bind(this),
          error: function (e){
            this.props.clearData();
          }.bind(this)
        });
      }else{
        this.setState({data: data});
      }
    },
    /**
     * 显示日历
     * */
    showDate: function (e){
      this.setState({
        dateShow: {
          state:"",
          endOrStart: e.target.getAttribute("data-name")
        }
      });
    },
    /**
     * 隐藏日历
     * */
    closeDate: function(){
      let state = this.state.dateShow;
      state.state = "hidden";
      this.setState({
        dateShow: state
      })
    },
    /**
     * 选择内容
     * */
    choseDate: function(e){
      this.clicked = true;
      let date = this.state.parameter;
      let endOrStart = this.state.dateShow.endOrStart;
      date[endOrStart] = e.target.getAttribute("data-value");
      if(date.endTime.split(".").join("") < date.startTime.split(".").join("")){
        let t = date.endTime;
        date.endTime = date.startTime;
        date.startTime = t;
      }
      this.setState({
        dateShow: {
          state:"hidden",
          endOrStart: ""
        },
        parameter: date
      });
      showData = [];
      this.request(function (data){
        this.clicked = false;
        this.init(data);
      }.bind(this));
    },
    /**
     * 画饼状图
     * @access private
     * @param clas 设置class
     * @param number 设置位置
     */
    drawImage(clas, number){
      var img = document.getElementsByClassName(clas)[number];
      var r = img.getAttribute("data-percent");
      r = r.split(",");
      var width = img.width;
      var height = img.height;
      var ctx = img.getContext("2d");
      var color = ["#4CD990", "#FFCD01", "#1667A9", "#EA533F", "#A849AC"];
      ctx.arc(width / 2, height / 2, height / 2, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      var sum = 0;
      r.map(function (line, key){
        let last = key === 0 ? 0 : r[key - 1].split("%")[0] * 3.6;
        sum = sum + last;
        line = line.split("%")[0];
        line = line * 3.6;
        drawPie();
        ctx.fillStyle = color[key] ? color[key] : color[key - 3];
        ctx.fill();

        function drawPie(){
          ctx.beginPath();
          ctx.moveTo(width / 2, height / 2);
          ctx.lineTo(Math.cos(sum * Math.PI / 180) * height / 2 + height / 2, Math.sin(sum * Math.PI / 180) * height / 2 + height / 2);
          ctx.arc(width / 2, height / 2, height / 2, sum * Math.PI / 180, (sum + line) * Math.PI / 180);
          ctx.lineTo(width / 2, height / 2);
          ctx.closePath();
        }
      });
    },
    /**
     * 审批列表翻页
     * @param index 页码
     * */
    changeIndex: function (index){
      let dataTable = this.state.dataTable;
      dataTable.parameter.pageIndex = index;
      $.ajax({
        url: "/api/Home/GetApproLendList",
        data: dataTable.parameter,
        success: function (obj){
          $(window).scrollTop(0);
          let _dataTable = this.state.dataTable;
          _dataTable.detailData = obj.data;
          _dataTable.pageInfo = obj.pageinfo;
          this.setState({
            data: [],
            dataTable: _dataTable
          });
        }.bind(this)
      });
    },
    /**
     * 最新投资列表翻页
     *
     * */
    changeNewLendIndex: function (index){
      let dataTable = this.state.newLendTable;
      dataTable.parameter.pageIndex = index;
      $.ajax({
        url: "/api/Customer/GetNewLendList",
        data: dataTable.parameter,
        success: function (obj){
          $(window).scrollTop(0);
          let _newLendTable = this.state.newLendTable;
          _newLendTable.detailData = obj.data;
          _newLendTable.pageInfo = obj.pageinfo;
          this.setState({
            data: [],
            newLendTable: _newLendTable
          });
        }.bind(this)});
    },
    /**
     * 更新后找到canvas后 -> drawImage
     * */
    componentDidUpdate: function (nextProps, nextState){
      let length = document.getElementsByClassName("canvas").length;
      for (let i = 0; i < length; i++){
        this.drawImage("canvas", i);
      }
    },
    /**
     * 下载操作
     * */
    moduleDownload: function(e){
      let id = e.target.getAttribute("data-id");
      /*$.ajax({
        url: "/api/Home/outPutExcle",
        data: {
          empId: id,
          token: this.props.Token,
          startTime: this.state.parameter.startTime,
          endTime: this.state.parameter.endTime
        },
        error: function (data){
          this.props.clearData();
        }.bind(this)
      })*/
      return "/api/Home/outPutExcle&empId"+id+"token:"+this.props.Token+"startTime:"+this.state.parameter.startTime
    },
    /**
     * 更新前（判断是否更新）
     *  关键词
     *    nextProps
     */
    componentWillUpdate: function (nextProps, nextState){
      if (nextProps.name === "expireLend"){
        return;
      }

      if (nextProps.name === "list"
        && nextProps.name !== this.props.name){
        $.ajax({
          url: "/api/Home/GetApproLendList",
          data: this.state.dataTable.parameter,
          success: function (obj){
            if (obj.data.length === 0){
              this.load = "没有获得数据";
            }
            $(window).scrollTop(0);
            let _dataTable = this.state.dataTable;
            _dataTable.detailData = obj.data;
            _dataTable.pageInfo = obj.pageinfo;
            this.setState({
              dataTable: _dataTable
            });
          }.bind(this)
        });
        return;
      }

      if (nextProps.name === "newLend"
        && nextProps.name !== this.props.name){
        $.ajax({
          url: "/api/Customer/GetNewLendList",
          data: this.state.newLendTable.parameter,
          success: function (obj){
            if (obj.data.length === 0){
              this.load = "没有获得数据";
            }
            $(window).scrollTop(0);
            let _dataTable = this.state.newLendTable;
            _dataTable.detailData = obj.data;
            _dataTable.pageInfo = obj.pageinfo;
            this.setState({
              newLendTable: _dataTable
            });
          }.bind(this),
          error: function (e){
            console.log(e);
          }
        });
        return;
      }

      if (nextProps.empId !== this.props.empId
        || nextProps.name !== this.props.name
        && nextProps.name && nextProps.name !== "expireLen"){
        $(window).scrollTop(0);
        if (showData[0] && !nextProps.name){
          this.setState({
            data: showData[0]
          });
          return;
        }

        if (showData[nextProps.name]){
          if (showData[nextProps.name]){
            this.load = "没有获得数据";
          }
          this.setState({
            data: showData[nextProps.name]
          });
          return;
        }
        this.clicked = true;
        this.props.changeRequesting(true);
        this.request(function (e){
          let array = [];
          this.props.changeRequesting(false);
          this.clicked = false;
          if (!e[0]){
            this.load = "没有获得数据";
          }
          /*dataMap = e.data.sort(function(a,b){
           return a.TotalMoney < b.TotalMoney;
           });*/
          e.data.map(function (line, key){
            let crown = "";
            if (key < 3 && e.data.length >= 3){
              crown = <img src={this.image[key]}/>;
            }
            let href = "/api/Home/outPutExcle?empId="+ line.EmpId +"&token="+ this.props.Token +"" +
              "&startTime="+ this.state.parameter.startTime +"&endTime="+ this.state.parameter.endTime;
            let arr = {
              name: line.EmpName,
              id: line.EmpId,
              company: [<span>
                <span className="crown">{crown}</span>
                {line.Company}
                {
                  line.Role > 10003 ?
                    <span className="moduleColorGreen">
                      {this.props.name}
                    </span> : ""
                }
                {this.role[line.Role - 1]}
                <span className="moduleColorGreen">
                  {line.EmpName}
                </span>
                {this.role[line.Role]}</span>],
              option: [<a href={href} className="iconfont download" data-id={line.EmpId}>&#xe621;</a>],
              title: this.props.Role <= 10001 ? ["业绩占比：" + line.Percent.toFixed(2) + "%", "所有金额：" + line.AllTotalMoeny.toFixed(0)] : [],
              /* addTitle: ["业绩占比："+ line.Percent.toFixed(2)+"%","所有金额："+line.AllTotalMoeny.toFixed(0)],*/
              data: {
                content: [
                  <div>
                    {line.TotalMoney}
                  </div>
                ]
              },
              showImg: false,
              addTitle: [<a onClick={this.showDetail} className="text-center block text-center" data-key={key}
                            data-id={line.EmpId}> 点击查看饼状图</a>],
              clickedData: [<a onClick={this.showDetail} className="text-center block text-center" data-key={key}
                               data-id={line.EmpId}> 点击查看数据</a>],
              img: [],
              additional: ["到期金额：" + line.ExpireTotalMoeny, "续期投资：" + line.RenewalLendMoeny],
              count: [
                "新增金额：" + line.NewLendMoeny,
                "新增注册：" + line.NewRegisterCount],
              role: line.Role
            };
            array.push(arr);
          }.bind(this));
          showData[nextProps.name] = array;
          this.setState({
            data: array
          });
        }.bind(this), nextProps.empId ? nextProps.empId : "", nextProps.name ? "/api/Home/GetStatistics" : "/api/Home/Index");
      }
    },
    /**
     * 当点击module时触发
     *    判断是否触发
     *    清空数据
     *    添加历史
     *    选择页面
     **/
    choPage: function (e){
      if (e.currentTarget.getAttribute("data-roleId") === "10007"){
        return;
      }
      if (this.clicked){
        return;
      }
      this.load = "正在读取数据.....";
      this.setState({data: []});
      this.props.setHistory(e.target.getAttribute("data-page"));
      this.props.chosePage(e);
    },
    /**
     * 提交请求
     * @params func
     * @params empId
     * @params newUrl
     * */
    request: function (func, empId, newUrl){
      let url = newUrl ? newUrl : this.state.url;
      let parameter = this.state.parameter;
      parameter.empId = empId ? empId : "";
      $.ajax({
        url: url,
        data: parameter,
        type: "GET",
        success: function (data){
          if (data.error){
            this.props.clearData();
            return;
          }
          func(data)

        }.bind(this),
        error: function (data){
          this.props.clearData();
        }.bind(this)
      })
    },
    render: function (){
      let title = {
        Title: "投资项目",
        CustomerName: "客户名",
        Money: "投资金额",
        EndTime: "结束日期",
        EmpName: "推荐人"
      };
      let tableStyle = [
        {
          pc: 2,
          phone: 2
        }, {
          pc: 2,
          phone: 2
        }, {
          pc: 3,
          phone: 3
        }, {
          pc: 2,
          phone: 1.5,
          format: function (e){
            let array,
              string;
            array = e.split("-");
            string = array[1] + "-" + array[2];
            return string;
          }
        }, {
          pc: 1,
          phone: 1.5
        }
      ];
      let _html = "";
      let _loadClass = "table moduleLoading";
      let _pageNumber = "";
      if (this.state.data[0]
        || this.props.name === "expireLend"
        || this.props.name === "list" && this.state.dataTable.detailData[0]
        || this.props.name === "newLend" && this.state.newLendTable.detailData[0]
      ){
        _loadClass = "hidden table moduleLoading";
      }
      switch (this.props.name){
        case "expireLend":
        {
          _html = <EmployeeTable title={title} tableStyle={tableStyle} data={detailData}/>;
          break;
        }
        case "list":
        {
          _html = <EmployeeTable title={this.state.dataTable.title} tableStyle={this.state.dataTable.tableStyle}
                                 data={this.state.dataTable.detailData}/>;
          break;
        }
        case "newLend":
        {
          _html = <EmployeeTable title={this.state.newLendTable.title} tableStyle={this.state.newLendTable.tableStyle}
                                 data={this.state.newLendTable.detailData}/>;
          break;
        }
        default:
        {
          _html = this.state.data[0] ? this.state.data.map(function (line){
            return <Module {...line} moduleClick={this.choPage}/>
          }.bind(this)) : "";
        }
      }
      if(this.props.name === "list" && this.state.dataTable.pageInfo.PageCount !== 1 && this.state.dataTable.pageInfo.PageCount){
        _pageNumber = <PageNumber index={this.state.dataTable.pageInfo.PageIndex}
                                  allPage={this.state.dataTable.pageInfo.PageCount}
                                  pageSize={this.state.dataTable.parameter.pageSize} changeIndex={this.changeIndex}/>
      }
      if(this.props.name === "newLend" && this.state.newLendTable.pageInfo.PageCount !== 1 && this.state.newLendTable.pageInfo.PageCount){
        _pageNumber = <PageNumber index={this.state.newLendTable.pageInfo.PageIndex}
                                  allPage={this.state.newLendTable.pageInfo.PageCount}
                                  pageSize={this.state.newLendTable.parameter.pageSize} changeIndex={this.changeNewLendIndex}/>
      }
      //console.log(this.state.data)
      return (
        <div>
          <div className={_loadClass}>
            <span className="va-middle">{this.load}</span>
          </div>
          {
            this.props.name !== "list" && this.props.name !== "newLend" && this.props.name !== "expireLend"
            ?
              <div className={"dataModule-main time-select "+this.state.dateShow.state}>
                <DateChose title="选择日期" closeDate={this.closeDate} clickDate={this.choseDate} />
              </div>
              :""
          }
          {
            _html
          }
          { _pageNumber}
        </div>
      )
    }
  });
  window.page = React.createClass({
    render: function (){
      let page;
      let propsPage = this.props.page.indexOf("?") !== -1
        ? this.props.page.split("?")[0]
        : this.props.page;
      switch (propsPage){
        case "/emp/emplist.html":
        {
          page = <ShowEmployee {...this.props} />;
          break;
        }
        case "welcomePage":
        {
          let empId = "",
            name = "",
            sp = this.props.page.split("?");
          if (sp[1]){
            empId = sp[1];
          }
          if (sp[2]){
            name = sp[2];
          }
          page = <Welcome {...this.props} empId={empId} name={name}/>;
          break;
        }
        case "/customer/info.html":
        {
          page = <ShowCustomer {...this.props} />;
          break;
        }
        case "showDetail":
        {
          page = <ShowDetail {...this.props} customerId={this.props.page.split("?")[1]}
                                             name={this.props.page.split("?")[2]}/>;
          break;
        }
      }
      return (
        <div className={this.props.page +" phone-no-relative enterPage overflow-auto"}>
          {page}
        </div>
      )
    }
  });
})(jQuery, window.formType, window.pageNumber, window.dataModule, window.dateChose);


