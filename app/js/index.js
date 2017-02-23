/**
 * Created by Administrator on 2016/10/18.
 */
(function($ ,PageProps){
  /*
   * 主界面
   * */
  const Main = {};
  const Li = React.createClass({
   /* shouldComponentUpdate: function(nextProps, nextState){
     // return nextProps["data-Id"] !== this.props["data-Id"];
      return nextState === "phone-hidden"
    },*/
    getInitialState: function (){
      return {
        touch: "phone-hidden"
      }
    },
    showLi: function(e){
      if(this.state.touch === "phone-block"){
        this.setState({touch: "phone-hidden"});
      }else{
        this.setState({touch: "phone-block"});
      }
    },
    render: function(){
      var child = this.props.child;
      return (
        <li onClick= {this.showLi} className={"phone-block-"+this.props.len+" "+this.props.clicked+ " "+this.props.page} >
          {this.props.name}
          {child ?
            <ul className={this.state.touch+" "+this.props.page}>
              {child.map(function(data){
                return <li key={data.Id} data-Id={data.Id} data-num={this.props["data-num"]} name={data.MeunName} data-page={data.Url}
                           onClick={this.props.nav}
                           data-grade={parseInt(this.props["data-grade"]) + 1}>{data.MeunName}</li>
              }.bind(this))}
            </ul> : ""}
        </li>
        )
    }
  });
  //左边数据
  Main.HeadImage = React.createClass({
    getDefaultProps:function(){
      return {
        src : "ytlogo.png"
      }
    },
    render: function(){
      return (
        <img src={"img/"+this.props.src} className="width-percent-80 block block-center" />
      )
    }
  });
  Main.UserInfo = React.createClass({
    changePage: function(e){
      this.props.setShow(e.target.getAttribute("data-name"));
    },
    render: function(){
      var data = this.props.userData;
      return (
        <div className="user-info clear-both phone-hidden">
          <Main.HeadImage />
          <div className="block-2-40 text-center">
            欢迎
          </div>
          <div className="block-2-60">
            {data.Name}
          </div>
          <div  className="block-2-90 text-center">
            <a onClick={this.changePage} data-name="forget" >修改密码</a>
          </div>
        </div>
      )
    }
  });
  Main.Nav = React.createClass({
    render: function(){
      var nav = {
        data:this.props.navData,
        ...this.props
      };
      return (
        <ul className="nav">
          {nav.data.map(function(data){
            return  <Li len={nav.data.length} clicked={this.props.clicked == data.id ? "clicked" : ""}
                        page={this.props.page === "welcomePage" ? "background-fff-80" :""}
                        key={data.id} data-page={data.page} data-grade={data.grade} data-Id={this.props.nowPageId}
                        data-num={data.id} child={data.child} nav={nav.onClick} name={data.name} />
          }.bind(this))}
        </ul>
      )
    }
  });
  Main.Left = React.createClass({
    shouldComponentUpdate: function(nextProps){
      return nextProps !== this.props;
    },
    render: function(){
      var props = this.props;
      return (
        <div className="block-2-15 height-full phone-bottom-bar">
          <Main.UserInfo {...props} />
          <Main.Nav navData={props.nav} page={props.page} nowPageId={props.nowPageId} clicked={props.clicked} onClick={props.chosePage} />
        </div>
      )
    }
  });
  //右边数据
  Main.Right = React.createClass({
    getDefaultProps: function(e){
      return {
        src:"dog.jpg"
      }
    },

    setHistory: function (page){
      let state={
        page: this.props.page
      };
      let nextState={
        page: page
      };
      let title="";
      let href = window.location.href;
      history.replaceState(state, title, href);
      history.pushState(nextState, title, href);
      this.setState({
        historyState:""
      });
    },
    componentWillMount: function(){
      let that = this;
      $(window).on("popstate",function(){
        var currentState = history.state;
        that.props.changePage(history.state.page);
        that.setState({
          historyState : currentState
        });
      });
    },
    getInitialState: function(){
      return {
        historyState: {
          page: ""
        }
      };
    },
    requesting: false,
    changeRequesting: function(boolean){
      this.requesting = boolean;
    },
    changePage: function(e){
      this.props.setShow(e.target.getAttribute("data-name"));
    },
    loginOut: function(){
      var other = {
        nav:[],
        listNum: [
          {
            id:1,
            name:"主页",
            page:"welcomePage",
            grade:1
          }
        ],
        clicked:""
      };
      $.ajax({
        url:"/api/Login/Logout",
        type: "get",
        data:{
          token: this.props.userData.Token
        },
        success: function(e){
          if(e.error){
            alert(e.error);
            return;
          }
          this.props.setData("","login");
          this.props.clearClicked();
          this.props.setToken(1);
        }.bind(this)
      });
    },
    goHistory: function(){
      if(this.requesting){
        return;
      }
      history.go(-1);
    },
    toIndex: function(){
      this.props.changePage("welcomePage");
    },
    render: function(){
      return (
        <div className={this.props.page === "welcomePage" ?
        "block-2-85 height-full pc-background-fff background-fff-80 phone-width-full"
        : "block-2-85 height-full pc-background-fff background-fff phone-width-full"}>
          {/*top*/}
          <div className="bar clear-both">
            <ul className="bar-nav block-2">
              {
                this.props.page.indexOf("showDetail") !== -1 || this.props.page.indexOf("welcomePage") !== -1
                &&  this.props.page.indexOf("?") !== -1?
                  <li onClick={this.goHistory}>返回</li>:<li onClick={this.toIndex} data-num="1" >主页</li>
              }
            </ul>
            <div className="login-option block-2">
              {/*欢迎 <img src={"img/" + this.props.src} /> {this.props.getData().Name}*/}
              {/*<span classNe="wrong-color" onClick={this.changePage} data-name="forget">修改密码</span>/*/}
              <span className="href-color" onClick={this.loginOut}>注销</span>
            </div>
          </div>
          {/*body*/}
          <Page.Welcome chosePage={this.props.chosePage} setHistory={this.setHistory}
                        page={this.props.page} changeRequesting={this.changeRequesting}
                        clearData={this.props.clearData} postData={this.props.postData} userData = {this.props.userData} setShow={this.props.setShow} />
        </div>
      )
    }
  });
  var Page = {};
  Page.Welcome =  React.createClass({
    shouldComponentUpdate: function(nextProps){
      return this.props.page !== nextProps.page || nextProps.postData==="refresh"
    },
    render:function(){
      return (
          <PageProps chosePage={this.props.chosePage} page={this.props.page} setHistory={this.props.setHistory}
                     postData={this.props.postData} clearData={this.props.clearData} changeRequesting={this.props.changeRequesting}
                     {...this.props.userData} setShow={this.props.setShow} />
      )
    }
  });

  window.indexPage = React.createClass({
    getInitialState: function(){
      return {
        data:"",
        page:"",
        listNum: [
          {
            id:1,
            name:"主页",
            page:"welcomePage",
            grade:1
          }
        ],
        nav :[{
          id: "",
          name: "",
          page: "",
          grade: "",
          child: ""
        }],
        clicked:"",
        nowPageId:""
      }
    },
    getDefaultProps: function(){
      return {
        url:"data/navList.json"
      }
    },
    requestNav:function(parameter){
      $.ajax({
        url:"/api/home/GetMeun",
        type:"get",
        data:parameter,
        success : function(data){
          if(data.error){
            alert(data.error);
            return;
          }
          var  stateNav = [];
          data.map(function(data){
            var nav={
              id : data.MeunID,
              name : data.MeunName,
              child : data.Items,
              page: '',
              grade : 2
            };
            stateNav.push(nav);
          }.bind(this));
          this.setState({nav:stateNav, nowPageId: "login",page:"welcomePage"});
        }.bind(this),
        error: function(data, status, err) {
          this.props.clearData();
          //console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
    },
    componentWillMount : function(){
      if(this.props.userData !== ""){
        var parameter={
          empId : this.props.userData.ID,
          groupId : this.props.userData.GroupID,
          token : this.props.userData.Token
        };
        this.requestNav(parameter);
      }
    },
    componentDidUpdate: function(nextProps){
      if(this.props.userData !== nextProps.userData && this.props.hidden !== "login"){
        var parameter={
          empId : this.props.userData.ID,
          groupId : this.props.userData.GroupID,
          token : this.props.userData.Token
        };
        this.requestNav(parameter);
      }
    },
    changePage: function(data){
      if(data){
        this.setState({page:data});
      }
    },
    clearClicked: function(){
      this.setState({
        clicked: "",
        listNum: [
          {
            id:1,
            name:"主页",
            page:"welcomePage",
            grade:1
          }
        ]
      });
    },
    changeListNum: function(data){
      var num = this.state.listNum;
      var sub = data.grade;
      var newNum = [];
      num.map(function(dat){
        if(dat.grade >= sub) {
          return;
        }
        newNum.push(dat);
      });
      newNum.push(data);
      this.setState({listNum:newNum});
    },
    chosePage: function(e){
      var _element = e.currentTarget;
      var page = _element.getAttribute("data-page") +"?"+ _element.getAttribute("data-id")+"?"+ _element.getAttribute("data-userName");
      var id = _element.getAttribute("data-Id");
      if(!page){
        return;
      }
      var addJson = {
        id: _element.getAttribute("data-num"),
        name: _element.getAttribute("name"),
        page: page,
        grade: _element.getAttribute("data-grade")
      };
      _element = null;
      this.setState({
        clicked: addJson.id,
        nowPageId: id
      });
      this.changeListNum(addJson);
      this.changePage(page);
    },
    render: function (){
      var hidden = (this.props.hidden != "login") ? "" : "hidden";
      return (
        <div id="nav" className={"no-scroll-contain phone-inherit " + hidden}>
          <Main.Left {...this.props} page={this.state.page} nav={this.state.nav}  nowPageId={this.state.nowPageId} clicked={this.state.clicked} chosePage={this.chosePage} />
          <Main.Right {...this.props} page={this.state.page} changePage={this.changePage} listNum={this.state.listNum} chosePage={this.chosePage} clearClicked={this.clearClicked} />
        </div>
      )
    }
  });
})(jQuery, window.page);
