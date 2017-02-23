/**
 * Created by Administrator on 2017/1/19.
 */

//form操作
//展示提示
function showTip(text, color){
  let defaultTip = this.state.tip;
  defaultTip.text = text ? text : defaultTip.text;
  defaultTip.color = color ? color : defaultTip.color;
  this.setState({
    tipState: "show",
    tip: defaultTip
  })
}
//关闭提示
function closeTip(){
  this.setState({
    tipState: "hide"
  })
}
//获取输入内容
function inputChange(e){
  let name,
    parameter,
    value;
  parameter = this.state.parameter;
  name = e.target.name;
  value = e.target.value;
  parameter[name] = value;
  typeof this.closeTip === "function" ? this.closeTip() : "";
  this.setState({
    parameter: parameter
  })
}
//延时处理
function inputChangeDelay(){
  var setTime;
  return (e ,func)=>{
    if (setTime){
      clearTimeout(setTime);
    }
    setTime = setTimeout(()=>{
      func()
    }, 500);
  }
}
//改变图片
function imageChange (e){
  let src =e.target.src+ new Date().getTime();
  this.setState({
    image: src
  })
}
export {showTip, closeTip, inputChange, imageChange, inputChangeDelay}
