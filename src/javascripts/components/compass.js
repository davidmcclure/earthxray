

import React from 'react';
import RadioComponent from '../lib/radio-component';

import {
  XRAY,
  POINT_CAMERA
} from '../constants';


export default class extends RadioComponent {


  static events = {
    [XRAY]: {
      [POINT_CAMERA]: 'setBearing'
    }
  }


  /**
   * Set initial state.
   */
  constructor(props) {

    super(props);

    this.state = {
      bearing: null
    };

  }


  /**
   * Set the bearing.
   *
   * @param {Number} bearing
   */
  setBearing(bearing) {
    this.setState({ bearing });
  }


  /**
   * Render the compass data.
   */
  render() {
    return (
      <div id="compass">
        <span>{this.state.bearing}</span>
      </div>
    );
  }


}
