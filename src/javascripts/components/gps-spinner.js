

import React, { Component } from 'react';
import Static from './static';
import barsSVG from '../images/loading-bars.svg';


export default class extends Component {


  /**
   * Render the GPS spinner.
   */
  render() {
    return (
      <div className="spinner">
        <Static html={barsSVG} />
        <p>Getting location...</p>
      </div>
    );
  }


}
