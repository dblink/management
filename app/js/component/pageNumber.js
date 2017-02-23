/**
 * Created by Administrator on 2016/10/28.
 */
import React, { Component } from 'react';

class PageNumber extends Component {
  constructor(props){
    super(props);
    this.changNumber = this.changNumber.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.inputChange = this.inputChange();
  }

  inputChange(){
    var setTime;
    return (e)=>{
      let that = this;
      let val = e.target.value;
      if (setTime){
        clearTimeout(setTime);
      }
      if (e.target.value && parseInt(e.target.value)){
        setTime = setTimeout(()=>{
          that.changNumber(val);
        }, 500);
      }
    }
  }

  changNumber(e){
    var data = typeof e === "string" ? e : e.target.getAttribute("data-number");
    var index = this.props.index;
    var allpage = this.props.allPage;
    if (data === "add"){
      data = index + 1;
    }
    if (data === "minus"){
      data = index - 1;
    }
    if (data > allpage){
      data = allpage;
    }
    if (data < 1){
      data = 1;
    }
    if (data === this.props.index){
      return;
    }
    this.props.changeIndex(data);
  }

  render(){
    var allpage = this.props.allPage;
    var index = this.props.index;
    var n = index > allpage - 2 ? allpage - 2 : index;
    n = n < 3 ? 3 : n;
    var start,
      end;
    if (allpage > 4){
      start = n - 2;
      end = n + 3;
    }else{
      start = 1;
      end = allpage + 1;
    }
    var map = [];
    var _indexPage = (index === 1) ? "clicked" : "";
    var _lastPage = (index === allpage) ? "clicked" : "";
    for (var i = start; i < end; i++){
      map.push({
        number: i,
        clicked: i === index ? "clicked" : ""
      })
    }
    return (
      <div className="page-number phone-width-full">
        <a className={"page-index phone-hidden "+ _indexPage} onClick={this.changNumber} data-number="1">
          首页
        </a>
        <a className={"page-perv " + _indexPage} onClick={this.changNumber} data-number="minus">
          上一页
        </a>
        {
          map.map(function (e){
            return <a className={e.clicked ? "clicked phone-hidden" : "phone-hidden"} onClick={this.changNumber}
                      data-number={e.number}>{e.number}</a>
          }.bind(this))
        }
        <a className={"page-next " + _lastPage} data-number="add" onClick={this.changNumber}>
          下一页
        </a>
        <a className={"page-last phone-hidden " + _lastPage} data-number={allpage} onClick={this.changNumber}>
          尾页
        </a>
            <span>
              <span>当前{this.props.index}页</span>/共{allpage}页
            </span>
        <input className="phone-hidden" type="tel" placeholder="请输入页码" onChange={this.inputChange}/>
      </div>
    )
  }
}
export default PageNumber;