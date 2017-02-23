/**
 * Created by Administrator on 2017/2/4.
 */
import React, { Component } from 'react';
import { Link, Redirect} from 'react-router';
class Li extends Component {
  render(){
    return (
      <li className={this.props.className}>
        {this.props.data.Url
          ? <Link to={this.props.data.Url}>
          {this.props.data.MeunName}
        </Link>
          : this.props.data.MeunName}

        {this.props.data.Items
          ? <List data={this.props.data.Items}/>
          : ""}
      </li>
    )
  }
}
class List extends Component {
  render(){
    return (
      <ul className="nav">
        {this.props.data.map((data, key) =>{
          return <Li data={data} key={key} className={key.toString() === this.props.clicked ? "clicked" : ""}/>
        })}
      </ul>
    )
  }
}

export default List;