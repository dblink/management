/**
 * Created by Administrator on 2017/1/20.
 */
import { browserHistory } from 'react-router'


const setToken = (value)=>{
  localStorage.time= new Date().getTime();
  localStorage.token = value;
};

const getToken = (name)=>{
  let _days = 20;
  let _nowTime = new Date().getTime();
  if(!localStorage.token|| !localStorage.time){
    return false;
  }
  if(_nowTime - localStorage.time > _days * 60 * 1000){
    localStorage.clear();
    return false;
  }
    return localStorage.token;
};



let storage = {
  setToken: (value) =>{
    setToken(value);
  },
  getToken: () =>{
    return getToken();
  },
  clearToken: () => {
   localStorage.clear();
  },
  setStorage: (e ,parameter) => {
    if(parameter){
      localStorage[parameter] = JSON.stringify(e);
      return;
    }
    localStorage.data = JSON.stringify(e);
  },
  getStorage: (parameter) => {
    if(parameter){
      return localStorage[parameter] ? $.parseJSON(localStorage[parameter]) : false;
    }
    return localStorage.data ? $.parseJSON(localStorage.data) : false;
  },
  clearStorage: (parameter) => {
    if(parameter){
      localStorage[parameter] = false;
    }
    localStorage.data = false;
    localStorage.time = "";
  },
  jump: (url) =>{
    browserHistory.push(url);
  }
};
export default storage