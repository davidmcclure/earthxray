

import React, { Component } from 'react';
import Overlay from './overlay';


export default class extends Component {


  /**
   * Render navigation.
   */
  render() {
    return (
      <div className="nav">

        <i className="toggle fa fa-bars"></i>

        <Overlay className="info">
          <h1>Earth Xray</h1>
        </Overlay>

      </div>
    );
  }


}
