

import React, { Component } from 'react';
import Overlay from './overlay';


export default class extends Component {


  /**
   * Render the orientation error modal.
   */
  render() {
    return (
      <Overlay className="error">
        <i className="fa fa-exclamation-circle"></i>
        <h1>Whoops, no accelerometer</h1>
        <p>Try it on your phone!</p>
      </Overlay>
    );
  }


}
