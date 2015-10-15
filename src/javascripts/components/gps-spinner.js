

import React, { Component } from 'react';
import Static from './static';
import iconSVG from '../images/spinner.svg';


export default class extends Component {


  /**
   * Render the GPS spinner.
   */
  render() {
    return (
      <div className="spinner">
        <Static className="fa-spin" html={iconSVG} />
        <p>Getting location...</p>
      </div>
    );
  }


}
