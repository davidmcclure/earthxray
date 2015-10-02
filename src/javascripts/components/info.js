

import React, { Component } from 'react';
import Overlay from './overlay';


export default class extends Component {


  /**
   * Render the info overlay.
   */
  render() {
    return (
      <Overlay className="info">
        <h1>Earth Xray</h1>
        <p>See through the world!</p>
      </Overlay>
    );
  }


}
