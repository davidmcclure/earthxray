

import React, { Component } from 'react';
import Overlay from './overlay';


export default class extends Component {


  /**
   * Render the orientation error modal.
   */
  render() {
    return (
      <Overlay>
        <i className="fa fa-exclamation-circle"></i>
        <h1 className="error">Whoops, no accelerometer</h1>
        <p>Try it on your phone!</p>
      </Overlay>
    );
  }


}
