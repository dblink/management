/**
 * Created by Administrator on 2017/2/5.
 */
import React, { Component } from 'react';

class Input extends Component {
  render(){
    return (
      <input {...this.props} />
    )
  }
}
Input.defaultProps = {
  type: "text",
  className: ""
};

class ShowDay extends Component {
  formated (time, centerStyle){
    time.month = time.month.toString().length === 1 ? "0"+time.month : time.month;
    time.day = time.day.toString().length === 1 ? "0"+ time.day : time.day;
    return time.year+centerStyle+time.month+centerStyle+time.day;
  }
  render(){
    let week = ["日", "一", "二", "三", "四", "五", "六"];
    let line = [];
    let props = this.props;
    let date = new Date();
    let firstDay = new Date(props.year, props.month-1, 1).getDay();
    let nowDay = {
      year: date.getFullYear(),
      month: date.getMonth()+1
    };
    let propsDay ={
      year: props.year,
      month: props.month
    };
    let lastMonth = {
      year: props.month >= 2 ? props.year : props.year - 1,
      month: props.month >= 2 ? props.month-1 : 12
    };
    let nowMonth = {
      year: props.year,
      month: props.month
    };
    let days = this.props.isLeapYear(lastMonth);
    let nowDays = this.props.isLeapYear(nowMonth);
    //设置每行内容
    for (let i = 0; i <= 5; i++){
      for (let j = 0; j < 7; j++){
        let color;
        color = j === 0 || j === 6 ? "weekend " : "";
        color += nowDay.year == propsDay.year && nowDay.month == propsDay.month && (i *7 +j +1 -firstDay) == date.getDate() ? " nowDay" : "";
        if (j < firstDay && i === 0){
          line.push(<Dates.col data={days-(firstDay-j-1)} className={"no-now-month days "+color}/>);
        }else if(i *7 +j +1 -firstDay <= nowDays){
          line.push(<Dates.col data={i *7 +j +1 -firstDay} chose="true" time={
              this.formated({year:props.year,month:props.month,day:i *7 +j +1 -firstDay}, ".")
            } className={"days "+color} dayChange={props.dayChange} />);
        }else{
          line.push(<Dates.col data={i *7 +j +1 -firstDay -nowDays} className={"no-now-month days "+color}/>);
        }
      }
    }
    return (
      <div className="date-days day-title clear-both text-right">
        {
          week.map(function (line, num){
            let color;
            color = num === 0 || num === 6 ? "weekend" : "";
            return <Dates.col data={line} className={color}/>
          })
        }
        {
          line.map(function (line){
            return line;
          })
        }
      </div>
    )
  }
}

class Col extends Component {
  render(){
    let props = this.props;
    return (
      props.chose ?
        <a className={props.className} data-value={props.time} onClick={props.dayChange}>{props.data}</a>
        :
        <span className={props.className}>{props.data}</span>
    )
  }
}

class calendar extends Component {
  constructor(props){
    super(props);
    let date = new Date();
    this.state = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      nowDay: date.getDate()
    };
    this.errorTip = this.errorTip.bind(this);
    this.testValue = this.testValue.bind(this);
    let testValue = ["title","closeDate","clickDate"];
    this.errorTip(testValue); //未传参错误提示
    this.isLeapYear = this.isLeapYear.bind(this);
    this.changeState = this.changeState.bind(this);
    this.judge = this.judge.bind(this);
    this.dayChange = this.dayChange.bind(this);
    this.close = this.close.bind(this);
  }
  errorTip(e){
    let that = this;
    e.map((line) => {
      that.testValue(line);
    })
  }
  testValue(e){
    if (!this.props[e]){
      console.error(e + "的值没有传递");
      return false;
    }else{
      return true;
    }
  }
  /** 判断一个月天数
   * @param date string
   * @return number days
   * */
  isLeapYear(date){
    let state = date;
    state.month = parseInt(state.month);
    if (state.month === 2 && (state.year % 400 === 0 || state.year % 4 === 0 && state.year % 100 !== 0 )){
      return 29;
    }else if (state.month === 2){
      return 28;
    }
    if(state.month < 8){
      if (state.month % 2 === 0){
        return 30;
      }else{
        return 31;
      }
    }
    if(state.month > 7){
      if (state.month % 2 === 1){
        return 30;
      }else{
        return 31;
      }
    }
  }
  /**
   * 输入的有效值
   * @pram e input
   **/
  changeState(e){
    let value,
      name,
      state;
    value = e.target.value;
    name = e.target.name;
    if(this.judge(value, name)){
      state = this.state;
      state[name] = parseInt(value) == value || value == "" ? value : parseInt(value);
      this.setState(state);
    }
  }
  /**
   * 判断输入有效值
   * @pram value
   * @pram name
   * @return boolean
   * */
  judge(value, name){
    if(name === "month"){
      return !(parseInt(value) > 12 || parseInt(value) < 1 || value.length === 1 && !parseInt(value))
    }
    if(name === "year"){
      return !(value.length > 4 || value.length === 4 && value > 2999 || value.length === 1 && !parseInt(value))
    }
  }
  dayChange(day){
    //console.log(day.target.getAttribute("data-value"));
    this.props.clickDate(day)
  }
  close(e){
    this.props.closeDate(e);
  }
  render(){
    let props,
      state;
    props = this.props;
    state = this.state;

    return (
      <div className="date-chose">
        <div className="close" onClick={this.close}>x</div>
        <div className="date-title">{props.title}</div>
        <div className="date-show">
          {props.chose}
        </div>
        <div className="text-center">
          <Dates.input hit="请输入年份" type="number" className="date-input" value={state.year} name="year" onChange={this.changeState}/>
          年
        </div>
        <div className="text-center">
          <Dates.input hit="请输入月份" type="number" className="date-input" value={state.month} name="month" onChange={this.changeState}/>
          月
        </div>
        <div>
          <Dates.showDay isLeapYear={this.isLeapYear} year={this.state.year ? this.state.year : 2017}
                         month={this.state.month ? this.state.month : 1} dayChange={this.dayChange} />
        </div>
      </div>
    )
  }
}