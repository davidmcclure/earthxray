

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Scene from './scene';
import GPSError from './gps-error';
import Center from './center';


@connect(state => ({
  started: state.xray.active,
  gpsError: state.errors.gps,
}))
export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {

    // Show error when geolocation fails.
    let gpsError = this.props.gpsError ? <GPSError /> : null;

    // Show center stats when VR is active.
    let center = this.props.started ? <Center /> : null;

    return (
      <div className="wrapper">
        <Scene />
        {gpsError}
        {center}
      </div>
    );

  }


}
