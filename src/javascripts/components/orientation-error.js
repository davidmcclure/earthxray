

import React, { Component } from 'react';


export default class extends Component {


  /**
   * Render the GPS error modal.
   */
  render() {
    return (
      <div className="error">

        <div className="content">
          <i className="fa fa-exclamation-circle"></i>
          <h1>Whoops, no accelerometer!</h1>
          <h4>Try it on your phone!</h4>
        </div>

      </div>
    );
  }


}
