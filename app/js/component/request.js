/**
 * Created by Administrator on 2017/1/19.
 */
import json from "../../interface.json";
import storage from "./storageOperation";

function request(type, func, setData){
  let req = json[type];
  let data = {};
  let parameter = setData ? setData : this.state.parameter;
  req.data.map((value) =>{
    /*if (!parameter[value]){
      console.info(value + "no value");
    }*/
    data[value] = parameter[value];
  });
  let rAjax = $.ajax({
    url: req.url,
    data: data,
    type: req.type,
    dataType: req.dataType,
    success: (data) =>{
      /*document.getElementsByClassName("mainWindow")[0].scrollTop = 0;*/
      func(data)
    },
    error: (data)=>{
      if (data.statusText !== "abort"){
        storage.clearStorage();
        storage.clearStorage("menu");
        storage.clearToken();
        storage.jump("/");
      }
    }
  });
  stop(rAjax);
}
let array = [];
function stop(ajx){
  if (ajx === "stop"){
    array.map((line) =>{
      line.abort();
    });
    return;
  }
  array.push(ajx)
}

export {request, stop}