

import React, { Component } from 'react';
import Bearing from './bearing';
import Calibration from './calibration';


export default class extends Component {


  /**
   * Render the compass info.
   */
  render() {
    return (
      <div id="compass">
        <Bearing />
        <Calibration />
      </div>
    );
  }


}
