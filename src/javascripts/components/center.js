

import React from 'react';
import RadioComponent from '../lib/radio-component';
import { kmToMi } from '../utils';

import {
  TRACE_XRAY_CENTER,
} from '../constants';


export default class extends RadioComponent {


  static channelName = 'center'


  static events = {
    xray: {
      [TRACE_XRAY_CENTER]: 'trace'
    }
  }


  /**
   * Set initial state.
   */
  constructor(props) {
    super(props);
    this.state = { distance: null };
  }


  /**
   * Set the distance.
   *
   * @param {Number} distance
   */
  trace(distance) {
    this.setState({ distance });
  }


  /**
   * Render the center.
   */
  render() {

    let distance;

    // If we're below the horizon.
    if (this.state.distance) {

      // KM -> miles.
      let miles = Math.round(kmToMi(this.state.distance));

      distance = (
        <div className="distance">
          <div>{miles.toLocaleString()}</div>{' '}
          <div className="unit">miles</div>
        </div>
      );

    }

    // If we're looking into space.
    else {
      distance = (
        <div className="distance">
          <div className="unit">Outer space!</div>
        </div>
      );
    }

    return (
      <div id="center">
        {distance}
      </div>
    );

  }


}
