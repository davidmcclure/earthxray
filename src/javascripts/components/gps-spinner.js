

import React, { Component } from 'react';


export default class extends Component {


  /**
   * Render the GPS spinner.
   */
  render() {
    return (
      <div id="gps-spinner">
        <div className="pulse"></div>
        <p>Getting location...</p>
      </div>
    );
  }


}
