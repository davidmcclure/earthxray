

import React, { Component } from 'react';


export default class extends Component {


  /**
   * Render the GPS spinner.
   */
  render() {
    return (
      <div className="spinner">
        <i className="fa fa-2x fa-spin fa-spinner"></i>
        <p>Getting location...</p>
      </div>
    );
  }


}
