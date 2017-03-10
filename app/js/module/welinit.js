/**
 * Created by Administrator on 2017/2/6.
 */
import React,{ Component } from 'react';
import storage from '../component/storageOperation';
import Module from '../component/welMoudle';
import welOperation from '../component/welOperation';
import {request} from '../component/request';
import {pieChart} from '../component/chart';
import {} from '../../css/page.css';
import loading from '../../img/loading.gif';
class WelInit extends Component {
  constructor(props){
    super(props);
  }

  format(data){
    if(!data){
      return;
    }
    let array = [];
    let small;
    let number;
    small = data.toString().split(".")[1];
    data = data.toString().split(".")[0];
    data = data.toString().split("");
    data.map((line, key) =>{
      let num = data.length - key;
      if (num % 3 === 0 && num !== data.length){
        array.push(",")
      }
      array.push(line);
    });
    if(small){
      number = array.join("")+"."+small;
    }else{
      number = array.join("");
    }

    return number;
  }

  render(){
    const Title = Module.Title;
    const Body = Module.Body;
    const DateTime = Module.DateTime;
    const date = new Date();
    let time = date.getFullYear() + "." + parseInt(1 + date.getMonth()) + "." + (date.getDate() < 10 ? "0" +
      date.getDate() : date.getDate());
    return (
      <div className="clear-both">
        <div className="dataModule-main relative">
          <Title data="入金总额"/>
          <Body data={this.format(this.props.data.totalmoney)} onClick={jumpTo} id="10000" truth={this.props.state} />
          <DateTime data="时间" time={time} checkbox="open" inputChange={this.props.inputChange} boxValue={this.props.boxValue}  />
        </div>
        {
          storage.getStorage().GroupID > 10001 ?
            <div className="dataModule-main relative">
              <Title data="本月即将到期客户(人)"/>
              <Body data={this.props.data.expireLend ? this.props.data.expireLend.count : <img src={loading} />} onClick={jumpTo} id="expireLend"/>
              <DateTime data="时间" time={time}/>
            </div> :
            <div className="dataModule-main relative">
              <Title data="业绩审批列表"/>
              <Body data="点击查看" onClick={jumpTo} id="lendList"/>
              <DateTime data="时间" time={time}/>
            </div>
        }
        <div className="dataModule-main relative">
          <Title data="我的最新投资"/>
          <Body data="点击查看" onClick={jumpTo} id="newLendList"/>
          <DateTime data="时间" time={time}/>
        </div>
      </div>
    )
  }
}

class Inside extends Component {
  constructor(props){
    super(props);
  }

  format(data){
    if(!data && data !==0){
      return;
    }
    let array = [];
    let small;
    let number;
    small = data.toString().split(".")[1];
    data = data.toString().split(".")[0];
    data = data.toString().split("");
    data.map((line, key) =>{
      let num = data.length - key;
      if (num % 3 === 0 && num !== data.length){
        array.push(",")
      }
      array.push(line);
    });
    if(small){
      number = array.join("")+"."+small;
    }else{
      number = array.join("");
    }

    return number;
  }

  componentDidUpdate(){
    let canvas = document.getElementsByTagName("canvas");
    let canvasArray = canvas.length ? canvas : [];
    let propsPercent = this.props.percent;
    for (let i = 0; i < canvasArray.length; i++){
      let line = canvasArray[i];
      let empId = line.getAttribute("data-empId");
      pieChart(line, propsPercent[empId]);
    }
  }

  render(){
    const Title = Module.Title;
    const Body = Module.Body;
    const Footer = Module.Footer;
    const SwitchKey = Module.FunctionKey;
    const Down = Module.Download;
    return (
      <div className="clear-both">
        {
          !this.props.data.length ?
            <div className="dataModule-main relative">
              <Title data=" "/>
              <Body  />
              <SwitchKey data=" "/>
              <Footer left=" " right=" "/>
              <Footer left=" " right=" "/>
              <Footer left=" " right=" "/>
            </div> : ""
        }
        {
          this.props.data.map((line, key)=>{
            const percent = this.props.percent[line.EmpId];
            let canvas;
            if (percent){
              canvas = (<div className="clear-both canvasImage">
                <canvas className="canvas" width="195" height="195" data-empId={line.EmpId}>您的浏览器不适用canvas请更新浏览器
                </canvas>
                <div className="clear-both pieWord">
                  <div className="block-1"><i></i>01月:<span>{!percent.One ? "0.00" : percent.One }%</span></div>
                  <div className="block-1"><i></i>03月:<span>{!percent.Three ? "0.00" : percent.Three}%</span></div>
                  <div className="block-1"><i></i>06月:<span>{!percent.Six ? "0.00" : percent.Six}%</span></div>
                  <div className="block-1"><i></i>12月:<span>{!percent.Twelve ? "0.00" : percent.Twelve}%</span></div>
                  <div className="block-1"><i></i>24月:<span>{!percent.TwtenyFour ? "0.00" : percent.TwtenyFour}%</span>
                  </div>
                </div>
              </div>);
            }
            return (
              <div className="dataModule-main relative" key={key}>
                <Title data={line.Company} name={line.EmpName} ranking={key+1} role={line.Role}
                       chiefName={this.props.chiefName}/>
                <Down href={"/api/Home/outPutExcle?token="+storage.getToken()+"&empId="+line.EmpId } />
                <Body data={ line.img ? canvas : this.format(line.TotalMoney)}
                      onClick={line.Role < 10007 ? jumpTo : ""} id={line.EmpId} truth={this.props.state}/>
                <Footer left={<SwitchKey data={ line.img ? "查看数据": "查看饼状图"} func={this.props.imgPercent} id={line.EmpId} keyId={key}/>}
                        right={<SwitchKey data={ line.more ? "收起" : "更多数据"} func={this.props.clickMore} id={line.EmpId} keyId={key} roleId={line.roleId}/>} />
                <Footer left={"业绩占比："+line.Percent.toFixed(2)+"%"} right={"所有金额："+line.AllTotalMoeny.toFixed(0)}/>
                {line.more ? <Footer left={"到期金额："+line.ExpireTotalMoeny} right={"续期投资："+line.RenewalLendMoeny}/>:""}
                {line.more ? <Footer left={"新增金额："+line.NewLendMoeny} right={"新增注册："+line.NewRegisterCount}/> :""}
              </div>
            )
          })
        }
      </div>

    )
  }
}
Inside.defaultProps = {
  data: []
};

function jumpTo(e){
  let id = e.currentTarget.getAttribute("data-id");
  let path = e.currentTarget.getAttribute("data-truth") === "1" ? "/truth/":"/index/";
  storage.jump(path + id);
}

export {Inside, WelInit}