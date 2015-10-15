

import React, { Component } from 'react';


export default class extends Component {


  /**
   * TODO
   * Render the GPS spinner.
   */
  render() {
    return (
      <div className="spinner">
        <i className="fa fa-spin fa-spinner"></i>
        <p>Getting location...</p>
      </div>
    );
  }


}
