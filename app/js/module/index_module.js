/**
 * Created by Administrator on 2017/2/14.
 */
import React, { Component } from 'react';
import Left from './left';
import { Link } from 'react-router';
import storage from '../component/storageOperation';
import { ModalSection ,ChangePassword} from '../module/modal';

class IndexModule extends Component {
  constructor(props){
    super(props);
    this.state = {
      showModal: false
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.contentModal = this.contentModal.bind(this);
    if(props.firstLogin){
      this.state = {
        showModal: true
      }
    }
  }

  loginOut(){
    storage.clearStorage();
    storage.clearStorage("menu");
    storage.clearToken();
    storage.jump("/");
  }

  toBack(){
    history.go(-1);
  }

  showModal(){
    this.setState({
      showModal: true
    })
  }

  closeModal(){
    this.setState({
      showModal: false
    })
  }

  contentModal(){
    return <ChangePassword closeModal={this.closeModal} noClose={this.props.firstLogin ? true : false }/>
  }

  render(){
    return (
      <div className="no-scroll-contain">
        {this.props.isShowModal ? <ModalSection html={this.props.html}/> : ""}
        {this.state.showModal ? <ModalSection html={this.contentModal}/> : ""}
        <Left onClick={this.showModal}/>
        <div className="block-2-85 height-full pc-background-fff background-fff-80 phone-width-full relative">
          {/*bar*/}
          <div className="bar clear-both">
            <ul className="bar-nav block-2">
              {
                this.props.id && this.props.history === "has" ?
                  <li><a onClick={this.toBack}>返回</a></li>
                  : <li><Link to="/index">主页</Link></li>
              }
            </ul>
            <div className="login-option block-2">
              <span className="href-color" onClick={this.loginOut}>注销</span>
            </div>
          </div>
          {/*welcome*/}
          <div className="mainWindow">
            {this.props.showInit()}
          </div>
        </div>
      </div>
    )
  }
}
export default IndexModule