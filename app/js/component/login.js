/**
 * Created by Administrator on 2016/10/12.
 */
(function ($, PageNumber){
  const Login = {},
    loginInfo = {};
  //组件
  const inputMixin = {
    /*componentWilMount: function() {
     this.data = {};
     },*/
    inputChange: function (e){
      var json = {};
      json[e.target.name] = e.target.value;
      this.setState(json);
      this.state.error.show ?
        this.closeError() : "";
    }
    /*componentWillUnmount: function() {
     return this.data;
     }*/
  };
  /** 登录
   * 标题按钮部分
   * */
  Login.Title = React.createClass({
    render: function (){
      return (
        <div className="row text-center">
          {this.props.title}
        </div>
      )
    }
  });
  /*
   * 表单部分
   * */
  Login.Body = React.createClass({
    getInitialState: function (){
      return {
        src: ""
      }
    },
    componentWillMount: function (){
      this.setState({
        src: this.props.timeStamp
      })
    },
    render: function (){
      var json,
        inputStyle,
        imageCenter,
        props;
      props = this.props;
      json = {
        icon: props.icon,
        type: props.type ? props.type : "text",
        tips: props.tips,
        ...props
      };
      imageCenter = "";
      if (props.src || props.inputButton && props.icon){
        inputStyle = "input text-left block-2-30";
      }else if (props.src || props.inputButton){
        inputStyle = "input text-left width-percent-50 inline";
        imageCenter = "text-center";
      }else if (!props.icon){
        inputStyle = "input text-left width-percent-80 block-center block";
      }
      return (
        <div className="row table loginContent clear-both">
          <div className={"va-middle "+imageCenter}>
            {/*如果有图标*/}
            {props.icon ? <span className="iconfont text-center block-2-20">{props.icon}</span> : ""}
            <input type={json.type} placeholder={json.tips} {...json} className={inputStyle}/>
            {props.src ?
              <img src={props.src + this.props.timeStamp} onClick={this.props.imageChange}
                   className="vcode width-percent-30"/>
              :
              ""
            }
            {props.inputButton ?
              <a onClick={this.props.buttonClick} data-name={this.props["data-name"]}
                 className="buttonClick width-percent-30 text-center">{props.inputButton}</a>
              : ""
            }
          </div>
        </div>
      )
    }
  });
  Login.Select = React.createClass({
    render: function (){
      var props = this.props;
      return (
        <div className="row table loginContent clear-both">
          <div className="va-middle">
            {/*如果有图标*/}
            {props.icon ? <span className="iconfont text-center block-2-20">{props.icon}</span> : ""}
            <select name={props.selectName} className="input text-left block-2-60" {...props}>
              <option selected={this.props.data ? "" : "selected" } disabled="disabled" value="null">
                请选择{props.selectChinaName}</option>
              {
                props.option.map(function (data){
                  return <Login.Option data={this.props.data}  {...data} />
                }.bind(this))
              }
            </select>
          </div>
        </div>
      )
    }

  });
  window.formType = {
    input: Login.Body,
    select: Login.Select
  };
  Login.Option = React.createClass({
    render: function (){
      return <option value={this.props.Value}
                     selected={parseInt(this.props.data) === parseInt(this.props.Value) ? "selected" : ""}>{this.props.Text}</option>
    }
  });

  /*
   * 表单报错
   * */
  Login.Error = React.createClass({
    getDefaultProps: function (){
      return {
        error: {
          bgColor: "",
          text: "",
          show: ""
        }
      }
    },
    render: function (){
      var error = this.props.error;
      var bgColor = error.bgColor;
      var text = error.text;
      return (
        <div className={"error " + (bgColor ? error.show +" "+bgColor : "")}>
          <span className="close" onClick={this.props.close}>
            x
          </span>
          {text}
        </div>
      )
    }
  });
  /*
   * 登录按钮
   * */
  Login.Button = React.createClass({
    render: function (){
      return (
        <div className="row text-center button">
          <input type="submit" {...this.props} className="height-full width-60"/>
        </div>
      )
    }
  });
  /*
   * 主登录界面
   * */
  window.login = React.createClass({
    mixins: [inputMixin],
    closeError: function (){
      this.setState({
        error: {
          show: ""
        }
      });
    },
    loginServer: function (parameter){
      $.ajax({
        url: this.props.url,
        type: "post",
        data: parameter,
        dataType: "json",
        success: function (data){
          this.setState({Password: '', CheckCode: '', timeStamp: new Date().getTime()});
          if (data.error){
            var error = {
              bgColor: "wrong-bg-color",
              text: data.error,
              show: "show"
            };
            this.setState({error: error});
            return;
          }
          this.props.setData(data, "index");
          this.props.setToken(data.Token);
          if (data.IsFristLogin){
            this.props.setShow({
              show: "forget",
              postData: "no-close"
            });
          }
        }.bind(this),
        error: function (xhr, status, err){
          this.props.clearData();
        }.bind(this)
      })
    },
    getInitialState: function (){
      return {
        UserName: "",
        Password: "",
        Submit: "立即登录",
        error: {
          show: ""
        },
        timeStamp: new Date().getTime()
      }
    },
    onInputChange: function (e){
      this.inputChange(e);
      this.state.error.show ?
        this.closeError() : "";
    },
    imageChange: function (){
      this.setState({timeStamp: new Date().getTime()});
    },
    loginSubmit: function (e){
      e.preventDefault();
      var user = this.state.UserName.trim();
      var password = this.state.Password.trim();
      var parameter = {
        UserName: user,
        Password: password
      };
      if (!user || !password){
        var error = {
          bgColor: "wrong-bg-color",
          text: "用户名，密码不能为空",
          show: "show"
        };
        this.setState({error: error});
        return;
      }
      if (this.setState.length === 4){
        return;
      }
      this.setState({Submit: "登录中...请稍后"});
      this.loginServer(parameter);

    },
    render: function (){
      var hidden = (this.props.hidden === "login") ? "" : "hidden";
      return (
        <form className={"table height-full no-scroll-contain form login-image"+ hidden} id="login"
              onSubmit={this.loginSubmit}>
          <div className="va-middle">
            <div className="container loginContainer">
              {/*
               FormTitle
               */}
              {/*<Login.Title title="欢迎登录缘天金服查询系统"/>*/}
              <Login.Error error={this.state.error} close={this.closeError}/>
              <Login.Body type="text" value={this.state.UserName} onChange={this.onInputChange}
                          name="UserName" tips="请输入用户名"/>
              <Login.Body type="password" value={this.state.Password} onChange={this.onInputChange}
                          name="Password" tips="请输入密码"/>
              {/*<Login.Body type="text" value={this.state.CheckCode} timeStamp={this.state.timeStamp}
               onChange={this.onInputChange} imageChange={this.imageChange} name="CheckCode" tips="请输入验证码"
               src={"../http/service/vcode?tip="}/>*/}
              <Login.Button type="submit" value="立即登录"/>
            </div>
          </div>
        </form>);
    }
  });
  /*
   * 修改密码
   * */
  window.forget = React.createClass({
    mixins: [inputMixin],
    closeError: function (){
      this.setState({
        error: {
          show: ""
        }
      });
    },
    getInitialState: function (){
      return {
        password: "",
        newPassword: "",
        user: "",
        phone: "",
        company: "",
        role: "",
        chief: "",
        vcode: "",
        msgVCode: "",
        send: "true",
        sendContent: "发送验证码",
        error: {
          show: ""
        }
      }
    },
    setChief: function (e){
      this.setState({chief: e});
    },
    componentDidUpdate: function (nextprops ,nextState){
      if (this.props.hidden === "showDetail"
        || this.props.hidden === "quit"
        || this.props.hidden === "forget"
        || this.props.postData === "no-close"
      ){
        return;
      }
      if(this.props.hidden === "editorReferee" || this.props.hidden === "editorEmpName"){
        return;
      }
      if (this.props.postData && this.props.postData !== "refresh" && this.props.userData){
        $.ajax({
          url: "/api/Employees/GetEmployeesItem",
          type: "get",
          data: {
            Token: this.props.userData.Token,
            empId: this.props.postData
          },
          dataType: "json",
          success: function (data){
            if (data == "null"){
              return;
            }
            if (data.error){
              alert(data.error);
              return;
            }
            var state = this.state;
            state.user = data.Name;
            state.phone = data.Mobile;
            state.chief = data.Chief;
            state.company = parseInt(data.Company);
            state.role = data.Role;
            state.userId = this.props.postData;
            this.props.postData = false;
            this.setState(state);
          }.bind(this),
          error: function (data){
            this.props.clearData();
          }.bind(this)
        });
      }
    },
    forgetServer: function (url, parameter, text){
      //请求
      $.ajax({
        url: url,
        type: "post",
        data: parameter,
        dataType: "json",
        success: function (data){
          var error;
          if (data.error){
            error = {
              bgColor: "wrong-bg-color",
              text: text + data.error,
              show: "show"
            };
            this.setState({error: error});
            return;
          }
          error = {
            bgColor: "success-bg-color",
            text: text + "成功！",
            show: "show"
          };
          if (this.props.postData === "no-close" && url.indexOf("ChangePassword") !== -1){
            let dat = this.props.getStorage();
            dat.IsFristLogin = false;
            this.props.setStorage(dat);
            this.setState({
              error: error
            });
            this.toLogin();
            return;
          }
          if (url.indexOf("SendSMSCode") !== -1){
            this.setState({
              send: false
            });
            this.timer();
            this.setState({
              error: error
            });
            return;
          }
          if (url.indexOf("EditEmployees") !== -1){
            this.setState({
              error: error
            });
          }else{
            this.setState({
              error: error,
              user: "",
              phone: ""
            });
          }
          if (url.indexOf("ChangeAllotEmpId") !== -1 || url.indexOf("ChangeChangeReferee") !== -1){
            this.setState({error: error});
            setTimeout(function(){
              this.changePage();
            }.bind(this),500);
          }
          this.props.setShow({
            show: this.props.hidden,
            postData: "refresh"
          });
        }.bind(this),
        error: function (data){
          this.props.clearData();
        }.bind(this)
      })
    },
    forgetSubmit: function (e){
      e.preventDefault();
      var state = this.state;
      var json = {};
      switch (e.target.getAttribute("data-name")){
        case "sendMessage":
        {
          json = {
            mobile: this.props.userData.Mobile,
            Token: this.props.userData.Token,
            CheckCode: this.state.vcode
          };
          this.forgetServer("/api/Employees/SendSMSCode", json, "短信发送：");
          break;
        }
        case "forget" :
        {
          json = {
            Token: this.props.userData.Token,
            empId: this.props.userData.ID,
            oldPassword: this.state.password,
            newPassword: this.state.newPassword,
            MsgVCode: this.state.msgVCode
          };
          this.forgetServer("/api/Employees/ChangePassword", json, "密码修改：");
          break;
        }
        case "addUser":
        {
          json = {
            Token: this.props.userData.Token,
            Name: state.user.trim(),
            Mobile: state.phone.trim(),
            Company: state.company,
            Role: state.role.trim(),
            Chief: state.chief === "null" ? "" : state.chief
          };
          this.forgetServer("/api/Employees/AddEmployees", json, "成员'" + json.Name + "'");
          break;
        }
        case "editorUser":
        {
          json = {
            Token: this.props.userData.Token,
            empID: state.userId,
            Name: state.user.trim(),
            Company: state.company,
            Role: state.role,
            Chief: state.chief === "null" ? "" : state.chief
          };
          this.forgetServer("/api/Employees/EditEmployees", json, "成员'" + json.Name + "'");
          break;
        }
        case "quit" :
        {
          json = {
            Token: this.props.userData.Token,
            empId: this.state.userId
          };
          this.forgetServer("/api/Employees/BatchOperationDimission", json, "");
          this.changePage();
          break;
        }
        case "editorEmpName":
        {
          if(this.state.chief === "null"){
            this.setState({error:{
              bgColor: "wrong-bg-color",
              text: "请选择业务人员",
              show: "show"
            }});
            return;
          }
          json = {
            Token: this.props.userData.Token,
            empId: this.state.chief,
            customerId: this.props.postData.userId.toString()
          };
          this.forgetServer("/api/Customer/ChangeAllotEmpId", json, "");
          break;
        }
        case "editorReferee":
        {
          if(this.state.chief === "null"){
            this.setState({error:{
              bgColor: "wrong-bg-color",
              text: "请选择人员",
              show: "show"
            }});
            return;
          }
          json = {
            Token: this.props.userData.Token,
            empId: this.state.chief,
            customerId: this.props.postData.userId.toString()
          };
          this.forgetServer("/api/Customer/ChangeChangeReferee", json, "");
        }
      }
      //请求前的判断
    },
    changePage: function (){
      var clear = {
        user: "",
        phone: "",
        password: "",
        newPassword: "",
        company: "",
        role: "",
        chief: "",
        vcode: "",
        msgVCode: "",
        error: {
          show: ""
        }
      };
      this.setState(clear);
      this.props.setShow({
        show: "index",
        postData: ""
      });
    },
    toLogin: function (){
      var clear = {
        user: "",
        phone: "",
        password: "",
        newPassword: "",
        company: "",
        role: "",
        chief: "",
        vcode: "",
        msgVCode: "",
        error: {
          show: ""
        }
      };
      this.setState(clear);
      $.ajax({
        url: "/api/Login/Logout",
        type: "get",
        data: {
          token: this.props.userData.Token
        },
        success:function(e){
          if(e.error){
            return;
          }
          this.props.setShow({
            show: "login",
            postData: ""
          });
        }.bind(this)
      });
    },
    setError: function (error){
      this.setState({
        error: error
      })
    },
    timer: function (){
      var n = 60;
      var that = this;
      (function time(){
        return setTimeout(function (){
          n--;
          that.setState({sendContent: n + "s"});
          if (n === 1){
            that.setState({
              sendContent: "发送验证码",
              send: true
            });
            return;
          }
          time()
        }, 1000)
      })();
    },
    render: function (){
      var hidden = (this.props.hidden === "forget"
      || this.props.hidden === "addUser"
      || this.props.hidden === "editorUser"
      || this.props.hidden === "editorEmpName"
      || this.props.hidden === "editorReferee"
      || this.props.hidden === "quit" ) ? "" : "hidden";
      var addUser = {
        user: this.state.user,
        phone: this.state.phone,
        password: this.state.password,
        company: this.state.company,
        role: this.state.role,
        chief: this.state.chief
      };
      return (
        <form className={"table height-full phone-fixed no-scroll-contain form "+ hidden} data-name={this.props.hidden}
              onSubmit={this.forgetSubmit}>
          <div className="va-middle">
            <div className="container">
              {
                this.props.postData === "no-close" ? ""
                  : <span className="close" onClick={this.changePage}>x</span>
              }
              {
                this.props.hidden === "forget"
                  ?
                  <ForgetPassword passowrd={this.state.password} setError={this.setError}
                                  closeError={this.closeError} error={this.state.error}
                                  vcode={this.state.vcode} newPasssword={this.state.newPassword}
                                  send={this.state.send}
                                  sendContent={this.state.sendContent} change={this.inputChange}
                                  forgetSubmit={this.forgetSubmit}/>
                  : ""
              }
              {
                this.props.hidden === "addUser"
                  ?
                  <AddUser setChief={this.setChief} {...addUser} {...this.props} closeError={this.closeError}
                           error={this.state.error} {...this.state.data} change={this.inputChange}/>
                  : ""
              }
              {
                this.props.hidden === "editorUser"
                  ?
                  <AddUser setChief={this.setChief} {...addUser} disabled="phone" {...this.props}
                           closeError={this.closeError}
                           error={this.state.error} {...this.state.data} change={this.inputChange}/>
                  : ""
              }
              {
                this.props.hidden === "quit"
                  ?
                  <div className="quit">
                    <Login.Title title="离职"/>
                    <div className="row content">
                      是否确认<span className="success-color">{this.props.postData.userName}</span>离职
                    </div>
                    <div className="row chose">
                      <input type="submit" value="确认"/>
                      <input type="button" value="取消" onClick={this.changePage}/>
                    </div>
                  </div>
                  : ""
              }
              {
                this.props.hidden === "showDetail"
                  ?
                  <ShowDetail token={this.props.userData.Token} clearData={this.props.clearData}
                              customerId={this.props.postData.userId} name={this.props.postData.userName}/>
                  : ""
              }
              {
                this.props.hidden === "editorEmpName" || this.props.hidden === "editorReferee"
                ?
                  <EditorEmpName page={this.props.hidden} id={this.props.userData.ID} token={this.props.userData.Token}
                                 clearData={this.props.clearData} chief={this.state.chief} role={this.state.role}
                                 company={this.state.company}
                                 empNameId={this.props.postData.userId} name={this.props.postData.userName}
                                 error={this.state.error} change={this.inputChange} closeError={this.closeError} />
                :""
              }
            </div>
          </div>
        </form>
      )
    }
  });
  const ShowDetail = React.createClass({
    getInitialState: function (){
      return {
        contractList: {
          selectName: "contract",
          selectChinaName: "合同类型",
          option: [
            {Text: "无", Value: "-1"}
          ]
        },
        parameter: {
          Token: this.props.token,
          customerId: this.props.customerId,
          pageSize: 5,
          pageIndex: 1,
          contractType: -1
        },
        data: null,
        pageInfo: []
      }
    },
    componentWillMount: function (){
      if (!this.state.contractList.option[1]){
        $.ajax({
          url: "/api/Customer/GetCustomerLendSelectList",
          data: {
            Token: this.props.token
          },
          success: function (data){
            if (data.error){
              return;
            }
            var contractList = this.state.contractList;
            contractList.option = data.data;
            contractList.option.unshift({Text: "无", Value: "-1"});
            this.setState({contractionList: contractList});
          }.bind(this),
          error: function (data){
            this.props.clearData();
          }.bind(this)
        });
      }
      this.request();
    },
    request: function (){
      var parameter = this.state.parameter;
      $.ajax({
        url: "/api/Customer/GetCustomerLendList",
        data: parameter,
        success: function (data){
          if (data.error){
            return;
          }
          this.setState({
            data: data.data[0] ? data.data : null,
            pageInfo: data.pageinfo
          });
        }.bind(this),
        error: function (data){
          this.props.clearData();
        }
      })
    },
    changeParameter: function (e){
      var para = this.state.parameter;
      para.contractType = e.target.value;
      para.pageIndex = 1;
      this.setState({parameter: para});
      this.request();
    },
    changeIndex: function (index){
      var parameter = this.state.parameter;
      parameter.pageIndex = index;
      this.setState({parameter: parameter});
      this.request();
    },
    render: function (){
      var title = {
        ContractMoney: "金额",
        ContractName: "投资名称",
        Cycle: "投资周期",
        Rate: "年化率",
        St: "开始时间",
        Et: "结束时间"
      };
      var tableWidth = [
        {
          pc: 2,
          phone: 3
        }, {
          pc: 2,
          phone: 3
        }, {
          pc: 1.5,
          phone: 2
        }, {
          pc: 1,
          phone: 2
        }, {
          pc: 1.5,
          phone: 0
        }, {
          pc: 1.5,
          phone: 0
        }
      ];
      return (
        <div className="showDetail">
          <Login.Title title={<p><span className="success-color">{this.props.name}</span>的投资详情</p>}/>
          <div className="width-percent-60">
            <Login.Select {...this.state.contractList} name="contractList" onChange={this.changeParameter}/>
          </div>
          { this.state.data == null
            ?
            <div className="text-center">暂无可用数据</div>
            :
            <div>

              <ShowTable title={title} width={tableWidth} data={this.state.data}/>
              {this.state.pageInfo.PageCount !== 1 && this.state.pageInfo.PageCount
                ? <PageNumber index={this.state.pageInfo.PageIndex} allPage={this.state.pageInfo.PageCount}
                              pageSize={this.state.parameter.pageSize} changeIndex={this.changeIndex}/>
                : "" }
            </div>
          }
        </div>
      )
    }
  });
  const ShowTable = React.createClass({
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
      var props = this.props;
      var title = [];
      for (var k in props.title){
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
              props.width[key].phone*10 +" percent-"+props.width[key].pc*10+" "+phone }>{props.title[title]}</div>
            }.bind(this))}
          </div>
          {props.data.map(function (row){
            return <ShowRow rowData={row} width={props.width} title={this.state.title}/>
          }.bind(this))}
        </div>
      )
    }
  });
  const ShowRow = React.createClass({
    getDefaultProps: function (){
      return {
        rowClick: []
      }
    },
    choseRow: function (e){
      if (e.currentTarget.getAttribute("data-start") === "false"){
        return;
      }
      var id = e.currentTarget.getAttribute("data-id");
      this.props.quitPeople(id);
    },
    render: function (){
      var props = this.props;
      return (
        <div className="row" data-id={props.rowData.ID}>
          {props.title.map(function (cols, key){
            if (key === props.title.length){
              return;
            }
            var color = "";
            return (
              <div className={"col table-content phone-percent-"+
              props.width[key].phone*10 +" percent-"+props.width[key].pc*10+" "+color }
                   title={props.rowData[cols]?props.rowData[cols]:"暂无数据"}>{props.rowData[cols] ? props.rowData[cols] : "暂无数据"}</div>
            )
          })}
        </div>
      )
    }
  });
  const ForgetPassword = React.createClass({
    sendMessage: function (e){
      if (!this.props.send){
        return;
      }
      if (!this.props.vcode || this.props.vcode.length < 4){
        let error = {
          bgColor: "wrong-bg-color",
          text: "验证码错误",
          show: "show"
        };
        this.props.setError(error);
        return;
      }
      this.props.forgetSubmit(e);
    },
    imageChange: function (){
      this.setState({timeStamp: new Date().getTime()});
    },
    getInitialState: function (){
      return ({
        timeStamp: new Date().getTime()
      })
    },
    render: function (){
      var props = {
        onChange: function (e){
          this.props.change(e);
          this.props.error.show ?
            this.props.closeError() : "";
        }.bind(this)
      };
      return (
        <div className="forgetPassword">
          <Login.Title title="修改密码"/>
          <Login.Error error={this.props.error} close={this.props.closeError}/>
          <Login.Body icon="&#xe609;" type="password" value={this.props.password} {...props} name="password"
                      tips="请输入旧密码"/>
          <Login.Body icon="&#xe609;" type="password" value={this.props.newPassword} {...props} name="newPassword"
                      tips="请输入新密码"/>
          <Login.Body icon="&#xe602;" type="text" value={this.props.vcode} timeStamp={this.state.timeStamp}
            {...props} imageChange={this.imageChange} name="vcode" tips="请输入验证码"
                      src={"../http/service/vcode?tip="}/>
          <Login.Body icon="&#xe60b;" type="tel" value={this.props.msgVCode} {...props}
                      buttonClick={this.sendMessage} inputButton={this.props.sendContent} data-name="sendMessage"
                      tips="短信验证码" name="msgVCode"/>
          <Login.Button type="submit" value="立即修改"/>
        </div>
      )
    }
  });
  const EditorEmpName = React.createClass({
    getInitialState: function(){
      return {
        companyList: {
          selectName: "Company",
          selectChinaName: "公司",
          option: [
            {Text: "园区", Value: "0"},
            {Text: "吴中", Value: "1"},
            {Text: "湖西", Value: "2"},
            {Text: "吴中二部", Value: "3"}
          ]
        },
        roleList: {
          selectName: "RoleList",
          selectChinaName: "角色",
          option: [
            {Text:"加载中",Value:"0"}
          ]
        },
        chiefList: {
          selectName: "Chief",
          selectChinaName: "业务人员",
          option:[
            {Text: "无", Value: "-1"}
          ]
        }
      }
    },
    componentWillMount: function(){
      if(this.props.page !== "editorEmpName"){
        $.ajax({
          url:"/api/Employees/GetRole",
          data: {
            empID: this.props.id,
            token: this.props.token
          },
          success: function(obj){
            this.state.roleList.option = obj;
          }.bind(this)
        })
      }

    },
    componentWillUpdate: function(nextProps){
      let referee = this.props.page === "editorReferee"
        && (this.props.role !== nextProps.role || this.props.company !== nextProps.company) && nextProps.role
        && nextProps.company;
      let empName = this.props.page === "editorEmpName"
        && this.props.company !== nextProps.company && nextProps.company;
      if (empName || referee){
        $.ajax({
          url: "/api/Employees/GetLeaderByCustomer",
          type: "get",
          data: {
            Token: this.props.token,
            roleID: this.props.page === "editorEmpName" ? 10007 : nextProps.role,
            company: nextProps.company
          },
          success: function (data){
            if(data === "null"){
              return;
            }
            if(data.error){
              alert(data.error);
              return;
            }
            var state = this.state;
            data.unshift({Text:"无",Value:"-1"});
            state.chiefList.option = data;
            this.setState(state);
          }.bind(this)
        });
      }

    },
    render: function (){
      var prop,
        page,
        word;
      prop = {
        onChange: function (e){
          this.props.change(e);
          this.props.error.show ?
            this.props.closeError() : "";
        }.bind(this)
      };
      page = this.props.page;
      word = page === "editorEmpName"?"业务员":"推荐人";
      return (
        <div className={page}>
          <Login.Title title={"修改"+word}/>
          <Login.Error error={this.props.error} close={this.props.closeError}/>
          <div className="tip" >当前{word}：<span className="success-color">{this.props.name}</span></div>
          <Login.Select icon="&#xe609;" {...this.state.companyList} data={this.props.company}  {...prop}
                        name="company" />
          {page !== "editorEmpName"
            ?
            <Login.Select icon="&#xe609;" {...this.state.roleList}  {...prop}
                          name="role" />
            :""
          }
          <Login.Select icon="&#xe609;" {...this.state.chiefList} data={this.props.chief} {...prop}
                        name="chief" />
          <Login.Button type="submit" value="确认修改" />
        </div>
      )
    }
  });
  /*
   * 添加人员
   * */
  let minxin = {
    getInitialState: function (){
      return {
        roleList: {
          selectName: "Role",
          selectChinaName: "角色",
          option: [
            {Text: "无", Value: "null"}
          ]
        },
        companyList: {
          selectName: "Company",
          selectChinaName: "公司",
          option: [
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
            {Text: "无", Value: "null"}
          ]
        }
      }
    },
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
          if (data.errorCode === 801){
            this.props.clearCode();
          }
          if (data == "null"){
            return;
          }
          if (data.error){
            alert(data.error);
            return;
          }
          var option = this.state.roleList;
          option.option = data;
          this.setState(option);
        }.bind(this),
        error: function (xhr, status, err){
          this.props.clearData();
        }.bind(this)
      });
      if (this.props.role && this.props.company){
        this.getLeader(this.props.role, this.props.company)
      }
    },
    componentDidUpdate: function (nextProps){
      var role = (this.props.role !== nextProps.role) && this.props.company !== "";
      var company = (this.props.company !== nextProps.company) && this.props.role !== "";
      if (role || company){
        this.getLeader(this.props.role, this.props.company);
      }
    },
    getLeader: function (roleID, company){
      var parameter = {
        roleID: roleID,
        company: company,
        token: this.props.userData.Token
      };
      $.ajax({
        url: "/api/Employees/GetLeader",
        type: "get",
        data: parameter,
        dataType: "json",
        success: function (data){
          if (data === null){
            this.props.setChief("");
            return;
          }
          if (!data[0].Value){
            return;
          }
          if (data.error){
            alert(data.error);
            return;
          }
          if (data !== "null"){
            var option = this.state.chiefList;
            option.option = data;
            var belong = JSON.stringify(data).indexOf(this.props.chief);
            if (belong === -1){
              this.props.setChief(data[0].Value);
            }else{
              this.props.setChief(this.props.chief);
            }
          }
          this.setState(option);
        }.bind(this),
        error: function (xhr, status, err){
          this.props.clearData();
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  };
  const AddUser = React.createClass({
    mixins: [minxin],
    render: function (){
      var prop = {
        onChange: function (e){
          this.props.change(e);
          this.props.error.show ?
            this.props.closeError() : "";
        }.bind(this)
      };
      return (
        <div className="addUser">
          <Login.Title title={this.props.hidden === "editorUser" ? "修改人员" :"添加人员"}/>
          <Login.Error error={this.props.error} close={this.props.closeError}/>
          <Login.Body icon="&#xe609;" type="text" value={this.props.user} {...prop} name="user" tips="输入用户名"/>
          <Login.Body icon="&#xe609;" type="text" value={this.props.phone}
                      disabled={this.props.disabled === "phone"?"disabled":""} {...prop} name="phone" tips="请输入手机号"/>
          <Login.Select icon="&#xe609;" {...this.state.roleList} data={this.props.role} {...prop} name="role"/>
          <Login.Select icon="&#xe609;" {...this.state.companyList} data={this.props.company}  {...prop}
                        name="company"/>
          <Login.Select icon="&#xe609;" {...this.state.chiefList} data={this.props.chief} {...prop} name="chief"/>
          <Login.Button type="submit" value={this.props.hidden === "editorUser" ? "确认修改" :"确认添加"}/>
        </div>
      )
    }
  })
})(jQuery, window.pageNumber);

