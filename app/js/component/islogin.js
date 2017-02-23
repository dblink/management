/**
 * Created by Administrator on 2017/1/20.
 */
import React from 'react';
import { Route } from 'react-router';
import storage from './storageOperation';
import Welcome from '../welcome';
import json from '../../pageList.json';
const requireAuth = (nextState, replace) =>{
  //判断token跳转
  if (!storage.getToken()){
    storage.clearStorage();
    storage.clearStorage("menu");
    replace({pathname: "/"});
  }
};
const jumpIndex = (nextState, replace) =>{
  if (storage.getToken()){
    replace({pathname: "/index"});
  }
};
const isRoot = (nextState, replace) =>{
  requireAuth(nextState, replace);
  if (storage.getStorage().ID < 10002){
    replace({pathname: "/index"})
  }

};
const isRootShowEmployee = (nextState, replace) =>{
  requireAuth(nextState, replace);
  if (storage.getStorage().Role > 10002 && storage.getStorage().Role !== 10010){
    replace({pathname: "/index"})
  }
};

const onlySmall10002 = (nextState, replace) =>{
  requireAuth(nextState, replace);
  if (storage.getStorage().ID >= 10002){
    replace({pathname: "/index"})
  }
};

export const AdminRoutes = (nextState, replace) =>{
  return (
    requireAuth(nextState, replace)
  )
};
export const JumpIndex = (nextState, replace) =>{
  return (
    jumpIndex(nextState, replace)
  )
};
export const IsRoot = (nextState, replace) =>{
  return (
    isRoot(nextState, replace)
  )
};
export const IsRootShowEmployee = (nextState, replace) =>{
  return (
    isRootShowEmployee(nextState, replace)
  )
};
export const OnlySmall10002 = (nextState, replace) =>{
  return (
    onlySmall10002(nextState, replace)
  )
};