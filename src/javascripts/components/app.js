

import React, { Component } from 'react';
import Scene from './scene';
import Errors from './errors';
import Stats from './stats';


export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {
    return (
      <div className="wrapper">
        <Scene />
        <Errors />
        <Stats />
      </div>
    );
  }


}
