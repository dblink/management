/**
 * Created by Administrator on 2017/1/13.
 */
import React, { Component } from 'react';
import { Router, Route, hashHistory, browserHistory, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import Login from './login';
import Welcome from './welcome';
import LendList from './lendList';
import NewLendList from './newLendList';
import ExpireLend from './expireLend';
import Customer from './customer';
import Employees from './employees';
import Count from './count';
//import Maintenance from './maintenance'; //维护页
import Undefined from './404';
import {AdminRoutes , JumpIndex, IsRoot, IsRootShowEmployee, OnlySmall10002} from './component/islogin';


class Rout extends Component{
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Router history={browserHistory}>
        {/*这有一个坑，Route path 为域名下的主页路径*/}
        <Route path="/">
          {/*当前页面*/}
          <IndexRoute component={Login} onEnter={JumpIndex} />
          <Route path="/index/lendList" component={LendList} onEnter={AdminRoutes} />
          <Route path="/index/newLendList" component={NewLendList} onEnter={AdminRoutes} />
          <Route path="/index/expireLend" component={ExpireLend} onEnter={IsRoot} />
          <Route path="/truth/:id" component={Welcome} onEnter={OnlySmall10002} />
          <Route path="/index(/:id)" component={Welcome} onEnter={AdminRoutes} />
          <Route path="/emp/emplist.html" component={Employees} onEnter={IsRootShowEmployee} />
          <Route path="/statistics/statistics.html" component={Count} onEnter={AdminRoutes} />
          <Route path="/customer/:id" component={Customer} onEnter={AdminRoutes} />
          <Route path="/**" component={Undefined} onEnter={AdminRoutes}/>
        </Route>
      </Router>
    )
  }
}
export default Rout;
