

import React from 'react';
import RadioComponent from '../lib/radio-component';

import {
  XRAY,
  TRACE_CENTER
} from '../constants';


export default class extends RadioComponent {


  static events = {
    [XRAY]: {
      [TRACE_CENTER]: 'setBearing'
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
   * @param {Number} distance
   * @param {Number} bearing
   */
  setBearing(distance, bearing) {
    this.setState({ bearing });
  }


  /**
   * Render the compass data.
   */
  render() {

    let degrees = Math.round(this.state.bearing);

    return (
      <div id="compass">
        <span className="degrees">{degrees}&deg;</span>
      </div>
    );

  }


}
