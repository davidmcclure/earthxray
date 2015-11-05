

import React, { Component } from 'react';
import Bearing from './bearing';


export default class extends Component {


  /**
   * Render the compass info.
   */
  render() {
    return (
      <div id="compass">
        <Bearing />
      </div>
    );
  }


}
