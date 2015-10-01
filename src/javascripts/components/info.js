

import React, { Component } from 'react';
import Overlay from './overlay';


export default class extends Component {


  /**
   * Render the overlay info.
   */
  render() {
    return (
      <Overlay className="info">
        <h1>Earth Xray</h1>
      </Overlay>
    );
  }


}
