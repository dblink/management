/**
 * Created by Administrator on 2017/2/10.
 */
import React, { Component } from "react";
import {} from '../../css/table.css';
class Table extends Component {
  constructor(props){
    super(props);
  }
  shouldComponentUpdate(nextProps){
    return nextProps !== this.props
  }
  render(){
    return (
      <div className="data-table">
        <div className="data-title">
          {
            this.props.setting.map((cols, key)=>{
              return (
                <Cols data={cols.title} key={key} setting={cols} table="true"/>
              )
            })
          }
        </div>
          {
            this.props.data.map((line, key)=>{
              return <Rows data={line} setting={this.props.setting} key={key}
                           rowsOperation={this.props.rowsOperation} click={this.props.click} empIdString={this.props.empIdString}/>
            })
          }
      </div>
    )
  }
}
class Rows extends Component {
  render(){
    var _string = this.props.empIdString;
    var _id = this.props.data.Id;

    return (
      <div className={ _string && _string.indexOf(_id) !== -1 ? "data-rows clicked" : "data-rows" }
           onClick={ this.props.click === "click" ? this.props.rowsOperation : ""} data-id={this.props.data.Id}>
        {
          this.props.data === "noData"
            ? <div>暂无数据</div>
            : this.props.setting.map((cols, key)=>{
            return (
              <Cols data={this.props.data[cols.attr]} setting={cols} key={key} id={cols.setId ? this.props.data[cols.setId] : ""} />
            )
          })
        }
      </div>
    )
  }
}
class Cols extends Component {
  render(){
    let setting = this.props.setting;
    let data = setting.format && !this.props.table ? setting.format(this.props.data) : this.props.data;
    return(
      <div className={"data-cols "+setting.className}>
        <span className={this.props.table ? "" : setting.dataClass} onClick={setting.click} id={this.props.id} >{data}</span>
      </div>
    )
  }
}

export default Table;