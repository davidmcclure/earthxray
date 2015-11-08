

import React, { Component } from 'react';
import Spinner from './spinner';


export default class extends Component {


  /**
   * Render the GPS spinner.
   */
  render() {
    return (
      <div id="gps-spinner">
        <Spinner />
        <p>Getting location...</p>
      </div>
    );
  }


}
