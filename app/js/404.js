/**
 * Created by Administrator on 2017/1/22.
 */
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router';
class Undefined extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <p>
          404
        </p>
        <p>
          not found this page
        </p>
      </div>
    )
  }
}
export default Undefined;