/**
 * Created by Administrator on 2017/2/9.
 */

import React, {Component} from 'react';

function _pieChart(canvas, data){
  var r = [];
  for (var i in data){
    r.push({data: data[i], name: i});
  }
  var width = canvas.width;
  var height = canvas.height;
  var ctx = canvas.getContext("2d");
  var color = ["#4CD990", "#FFCD01", "#1667A9", "#EA533F", "#A849AC"];
  ctx.arc(width / 2, height / 2, height / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  var sum = 0;
  r.map(function (line, key){
    let last = key === 0 ? 0 : r[key - 1].data ? r[key - 1].data.split("%")[0] * 3.6 : 0;
    sum = sum + last;
    let radian = line.data ? line.data.split("%")[0] * 3.6 : 0;
    drawPie(radian);
    ctx.fillStyle = color[key];
    ctx.fill();

    function drawPie(radian){
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(Math.cos(sum * Math.PI / 180) * height / 2 + height / 2, Math.sin(sum * Math.PI / 180) * height / 2 + height / 2);
      ctx.arc(width / 2, height / 2, height / 2, sum * Math.PI / 180, (sum + radian) * Math.PI / 180);
      ctx.lineTo(width / 2, height / 2);
      ctx.closePath();
    }
  });
}

function LineChart(json){
  this.id = json.id;
  this.class = json.class;
  this.element = json.element;
  this.data = json.data;
  this.color = json.color ? json.color : "grey";
  this.saveContext = this._canvas().getContext('2d');
  this._pathDot = [];
  this.innerMargin = json.innerMargin ? json.innerMargin : "";
  this.times = json.times ? json.times : 1;
  this.base = json.base ? json.base : 100;
  this.timesName = json.timesName ? json.timesName : "元";
  this.axisX = json.axisX;
  this.hiddenKey = [];
}
LineChart.prototype = {
  constructor: LineChart,

  generateLineCanvas: function (){
    var _canvas = document.createElement('canvas');
    _canvas.height = this._canvas().height;
    _canvas.width = this._canvas().width;
    _canvas.className = this.className;
    this.element = _canvas;
    this.class = "";
    return _canvas;
  },

  background: function (){
    var list = [];
    for (var i = 0; i < 14; i++){
      list.push(i * this.base / this.times);
    }
    var month = this.axisX ? this.axisX : ["1月份", "2月份", "3月份", "4月份", "5月份", "6月份", "7月份",
      "8月份", "9月份", "10月份", "11月份", "12月份"];
    var _canvas = this._canvas();
    var _context = _canvas.getContext("2d");
    if (!_context){
      return;
    }
    var _this = this;
    _this.innerX = 48;
    _this.innerY = 48;
    _this.width = _canvas.width - _this.innerX;
    _this.height = _canvas.height - _this.innerY;

    var _listLength = list.length;
    var _monthLength = month.length;
    _this._marginY = _this.height * (_listLength - 1) / _listLength / _listLength;
    _this._marginX = _this.width * (_monthLength) / _monthLength / _monthLength;
    _canvas = null;

    list.map(function (e, key){

      _this.drawText(_context, e, _this.innerX, _this.height - (_this._marginY * (key)));
      _context.beginPath();
      _context.moveTo(_this.innerX, _this.height - (_this._marginY * (key)));
      _context.lineTo(_this.innerX + _this._marginX * (_monthLength), _this.height - (_this._marginY * (key)));
      _context.lineWidth = 1;
      _context.strokeStyle = "#f1f1f1"; //背景线的颜色
      _context.stroke();
    });

    month.map(function (e, key){
      _context.beginPath();
      _context.moveTo(_this.innerX + _this._marginX * (key), _this.height);
      _context.lineTo(_this.innerX + _this._marginX * (key), _this.height - (_listLength - 1) * _this._marginY);
      _context.stroke();
      _context.fillStyle = "#123456";
      _context.font = "14px Arial";
      _context.textAlign = "center";
      _context.textBaseline = "middle";
      _context.fillText(e, _this._marginX * (key) + _this.innerX + _this._marginX / 2, _this.height + _this.innerY / 2);
    });
    _context.beginPath();
    _context.moveTo(_this.innerX + _this._marginX * (_monthLength), _this.height);
    _context.lineTo(_this.innerX + _this._marginX * (_monthLength), _this.height - (_listLength - 1) * _this._marginY);
    _context.stroke();
    _this.drawText(_context, "单位：" + _this.timesName, 100, 20);
  },

  line: function (){
    var base = this.base / this.times;
    var _this = this;
    var _canvas = this._canvas();
    var _context = _canvas.getContext("2d");
    if (!_context){
      return;
    }
    var list = _this.data;
    _context.beginPath();

    _context.moveTo(_this._marginX, _this.height - _this._marginY);

    list.map(function (e, key){
      e = e.Money / _this.times;
      _context.lineTo(_this._marginX * (key + 2), _this.height - _this._marginY * (e / base + 1));
    });
    _context.lineWidth = 1.5; //线宽
    _context.strokeStyle = this.color;
    _context.stroke();
  },

  isPath: function (x, y){
    var _this = this;
    var json = {
      inPath: false,
      position: -1
    };
    var _context = _this.saveContext;
    if (_context.isPointInPath(x, y)){
      json.inPath = true;
      json.position = (x / _this._marginX).toFixed(0);
    }
    return json;
  },

  clear: function (){
    var _context = this._canvas().getContext("2d");
    _context.clearRect(0, 0, this.width, this.height);
  },

  chartDot: function (){
    var _this = this;
    var _dot = _this.data;
    var base = this.base / this.times;
    var _context = this.dotContext = this._canvas().getContext("2d");
    _context.beginPath();
    _dot.map(function (e, key){
      e = e.Money / _this.times;
      _this._drawDot(_this._marginX * (key + 2), _this.height - _this._marginY * (e / base + 1));
      _this._pathDot.push({x: _this._marginX * (key + 2), y: _this.height - _this._marginY * (e / base + 1)});
    });
    _context.fillStyle = "#dddddd"; //点的颜色
    _context.fill();
  },

  drawText: function (_context, text, x, y){
    _context.fillStyle = "#123456";
    _context.font = "14px Arial";
    _context.textAlign = "right";
    _context.textBaseline = "middle";
    _context.fillText(text, x -10, y);
  },

  drawRect: function (key){
    var _this,
      _data,
      _columnMarX,
      _base,
      _rectX,
      _rectY,
      _context;
    _this = this;
    _data = _this.data;
    _base = _this.base;
    _context = _this._canvas().getContext("2d");
    _columnMarX = _this.innerMargin ? _this.innerMargin : (_this._marginX - _this._marginX * .3) / 2;
    _context.beginPath();
    _context.fillStyle = _this.color;
    _rectX = _this._marginX * (key) + _this.innerX + _columnMarX;
    _rectY = _this.height - _this._marginY * (_data.Money / _base);
    _context.rect(_rectX, _rectY, _this._marginX * .3, _this._marginY * _data.Money / _base);
    _context.fill();
    _context.fillStyle = "#123456";
    _context.font = "14px Arial";
    _context.textAlign = "center";
    _context.textBaseline = "bottom";
    _context.fillText(_data.Money, _rectX + _this._marginX * .15, _rectY);
  },

  _canvas: function (){
    if (this.id){
      return document.getElementById(this.id);
    }
    if (this.class){
      return document.getElementsByClassName(this.class)[0];
    }
    if (this.element){
      return this.element;
    }
    console.log("need Elements! class or id");
    return false;
  },

  _drawDot: function (x, y, r){
    var _context = this.dotContext;
    r = r ? r : 4;
    this.saveContext.moveTo(x, y);
    this.saveContext.arc(x, y, r, 0, 2 * Math.PI);
    _context.moveTo(x, y);
    _context.arc(x, y, r, 0, 2 * Math.PI);
  },

  drawDot: function (x, y, r){
    var _context = this._canvas().getContext("2d");
    _context.beginPath();
    _context.moveTo(x, y);
    _context.arc(x, y, r, 0, 2 * Math.PI);
    _context.fillStyle = "#ededed";
    _context.fill();
  },

  dataSum: function (x, y, data){
    var _div = document.getElementsByClassName("dataList")[0];
    _div.style.display = "block";
    _div.innerHTML = "";
    var _p = "";
    var _this = this;
    data.map(function (line, key){
      if (_this.hiddenKey.indexOf(line.key) !== -1){
        return
      }
      _p += "<p>" + line.name + "</p><p>总金额</p><p>" + line.money + "</p>";
    });
    _div.innerHTML = _p;
    if (x + 10 + _div.offsetWidth + _this._marginX > _this.width){
      _div.style.right = (_this.width - x + 10) + "px";
      _div.style.left = "auto";
    }else{
      _div.style.left = (x + 10) + "px";
      _div.style.right = "auto";
    }
    if (y + 10 + _div.offsetHeight + _this._marginY > _this.height){
      _div.style.bottom = (_this.height - y + 10) + "px";
      _div.style.top = "auto";
    }else{
      _div.style.bottom = "auto";
      _div.style.top = (y + 10) + "px";
    }
  },

  hover: function (point, list, position){
    var isPoint = [];
    var _this = this;
    list.map(function (line, key){
      var _nowLayer = (_this.height - point.layerY - _this._marginY) / _this._marginY;
      var _point = line.MonthList[position - 2].Money / _this.base;
      var _diff = Math.abs(_nowLayer - _point);
      _nowLayer = _point = null;
      if (_diff < .3){
        if (_this.hiddenKey.indexOf(key) !== -1){
          return;
        }
        isPoint.push({key: key, money: line.MonthList[position - 2].Money, name: line.Name})
      }
      _diff = null;
    });
    return isPoint;
  },

  hideData: function (){
    var _div = document.getElementsByClassName("dataList")[0];
    _div.style.display = "none";
  },

  drawError: function (text){
    let _canvas,
      _context;
    _canvas = this._canvas();
    _context = _canvas.getContext("2d");
    _context.fillStyle = "#123456";
    _context.font = "20px Arial";
    _context.textAlign = "center";
    _context.textBaseline = "middle";
    console.log(this.width, this.height);
    _context.fillText(text, (_canvas.width)/2, (_canvas.height)/2);
  }
};

let drawChart = {
  lzy: {
    _mapMax: (expectList, data, option1, option2, choseMonth)=>{
      let recode;
      recode = 1;
      data.map((line, key)=>{
        if (expectList.indexOf(key.toString()) === -1){
          return;
        }
        line[option1].map((data, key)=>{
          if(!choseMonth || choseMonth === key.toString()){
            recode = Math.max(recode, data[option2]);
          }
        });
      });

      recode = Math.ceil(recode);
      return recode;
    },
    _getUnit: (recode)=>{
      let length,
        returnJson;
      returnJson = {};
      length = recode.toString().length;
      recode = recode / 13 / Math.pow(10, length - 2);
      recode = Math.ceil(recode);
      recode = recode * Math.pow(10, length - 2);
      returnJson.base = recode;

      switch (length){
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        {
          returnJson.times = 1;
          returnJson.timesName = "元";
          break;
        }
        case 6:
        {
          returnJson.times = Math.pow(10, length - 3);
          returnJson.timesName = "千元";
          break;
        }
        case 7:
        {
          returnJson.times = Math.pow(10, length - 3);
          returnJson.timesName = "万元";
          break;
        }
        case 8:
        {
          returnJson.times = Math.pow(10, length - 3);
          returnJson.timesName = "十万";
        }
      }
      return returnJson;
    },
    _isFinishDrawBg: (_chart, checkList, list, month)=>{
      let _maxJson;
      _maxJson = drawChart.lzy._mapMax(checkList, list, "MonthList", "Money", month);
      _maxJson = drawChart.lzy._getUnit(_maxJson);
      _chart.base = _maxJson.base;
      _chart.times = _maxJson.times;
      _chart.timesName = _maxJson.timesName;
      _chart.axisX = [];
      list.map((line, key)=>{
        if (checkList.indexOf(key.toString()) === -1){
          return;
        }
        _chart.axisX.push(line.Name);
      });
      _chart.background();
      return true;
    },
    _sumData: (expectList, data, option1, option2, month)=>{
      let sum = {};
      data.map((line, key)=>{
        if (expectList.indexOf(key.toString()) === -1){
          sum[option1] = []
          return;
        }

        line[option1].map((data, key)=>{

        })
      })
    },
    columnChartOperation: (setting, list, checkList)=>{
      let _vCanvas,
        _chart,
        _document,
        _isFinishBg,
        _currentElement;
      _document = document;
      _currentElement = _document.getElementsByClassName(setting.currentClassName)[0];
      _currentElement.innerHTML = "";
      _vCanvas = _document.createElement("canvas");
      /*_vTip = _document.createElement("div");
      _vTip.className = "dataList text-center";
      _currentElement.appendChild(_vTip);*/

      _vCanvas.height = 600;
      _vCanvas.width = _currentElement.clientWidth;
      _chart = new LineChart({element: _vCanvas});
      if(!list.length){
        _chart.drawError("没有任何数据");
        _currentElement.appendChild(_vCanvas);
        return;
      }
      _isFinishBg = drawChart.lzy._isFinishDrawBg(_chart, checkList, list, setting.month);
      if(_isFinishBg){
        _currentElement.appendChild(_vCanvas);
      }
      _chart.className = setting.lineClassName;

      list.map((()=>{
        let n = 0;
        return (line, key)=>{
          if (checkList.indexOf(key.toString()) === -1){
            return;
          }
          _chart.color = setting.color[key];
          _chart.data = line.MonthList[setting.month];
          _chart.drawRect(n);
          n = n + 1;
        }
      })())
    }
  }
};


function _lineChartOperation(setting, list, checkList){
  let _canvas,
    _vCanvas,
    _vTip,
    _chart,
    _maxJson,
    _document,
    _currentElement;
  _document = document;
  _currentElement = _document.getElementsByClassName(setting.currentClassName)[0];
  _currentElement.innerHTML = "";
  _vCanvas = _document.createElement("canvas");
  _vTip = _document.createElement("div");
  _vTip.className = "dataList text-center";
  _currentElement.appendChild(_vTip);

  _vCanvas.height = 600;
  _vCanvas.width = 1000;
  _chart = new LineChart({element: _vCanvas});
  //画背景
  //_chart.className = setting.bgClassName;

  _maxJson = _mapMax(checkList, list, "MonthList", "Money");
  _maxJson = _getUnit(_maxJson);
  _chart.base = _maxJson.base;
  _chart.times = _maxJson.times;
  _chart.timesName = _maxJson.timesName;
  _chart.background();
  _currentElement.appendChild(_vCanvas);
  _chart.className = setting.lineClassName;
  //画线和点
  list.map((line, key)=>{
    if (checkList.indexOf(key.toString()) === -1){
      return;
    }
    _chart.color = setting.color[key];
    _chart.data = line.MonthList;
    _canvas = _chart.generateLineCanvas();
    _chart.line();
    _chart.chartDot();
    _currentElement.appendChild(_canvas);
  });
  _canvas = _chart.generateLineCanvas();
  _currentElement.appendChild(_canvas);
  var last = {x: 0, y: 0};
  //浮动显示
  _canvas.addEventListener("mousemove", function (e){
    var _json = _chart.isPath(e.layerX, e.layerY);
    if (_json.inPath){
      if (Math.abs(e.layerX - last.x) < 10 && Math.abs(e.layerY - last.y) < 10){
        return;
      }
      last.x = e.layerX;
      last.y = e.layerY;
      var isPoint = _chart.hover(e, list, _json.position);
      if (isPoint.length){
        this.style.cursor = "pointer";
        _chart.drawDot(_json.position * _chart._marginX, _chart.height - (isPoint[0].money / _chart.base + 1) * _chart._marginY, 3);
        _chart.dataSum(_json.position * _chart._marginX, _chart.height - (isPoint[0].money / _chart.base + 1) * _chart._marginY, isPoint);
      }
    }else{
      last = {x: 0, y: 0};
      _chart.clear();
      _chart.hideData();
      this.style.cursor = "auto"
    }
  });
}

/*function _columnChartOperation(setting, list, checkList){

}*/

const pieChart = (canvas, data) =>{
  return _pieChart(canvas, data);
};

const columnChart = (setting, list, checkList, month) =>{
  if(month){
    setting.month = month;
  }
  return drawChart.lzy.columnChartOperation(setting, list, checkList)
};

const lineChart = (setting, list, checkList) =>{
  return _lineChartOperation(setting, list, checkList)
};

export {pieChart, lineChart, columnChart}