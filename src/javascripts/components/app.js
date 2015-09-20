

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Scene from './scene';
import GPSError from './gps-error';
import OrientationError from './orientation-error';
import Center from './center';


@connect(state => ({
  started: state.xray.active,
  errors: state.errors,
}))
export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {

    // Toggle geolocation error.
    let gpsError = this.props.errors.gps ?
      <GPSError /> : null;

    // Toggle accelerometer error.
    let orientationError = this.props.errors.orientation ?
      <OrientationError /> : null;

    // Show stats when VR starts.
    let center = this.props.started ?
      <Center /> : null;

    return (
      <div className="wrapper">
        <Scene />
        {gpsError}
        {orientationError}
        {center}
      </div>
    );

  }


}
