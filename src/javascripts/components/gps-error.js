

import React, { Component } from 'react';


export default class extends Component {


  /**
   * Render the GPS error modal.
   */
  render() {
    return (
      <div className="error">
        <div className="error-content animated flipInX">
          <i className="fa fa-exclamation-circle"></i>
          <h1>Whoops, can't get a GPS location</h1>
          <p>Try it on your phone!</p>
        </div>
      </div>
    );
  }


}
