

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Scene from './scene';
import GPSError from './gps-error';
import OrientationError from './orientation-error';
import Info from './info';
import GPSSpinner from './gps-spinner';
import Center from './center';
import ZoomTip from './zoom-tip';
import Calibration from './calibration';
import Bearing from './bearing';


@connect(state => ({
  xray: state.xray,
  errors: state.errors,
  info: state.info,
  scene: state.scene,
}))
export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {
    return (
      <div className="wrapper">

        <Scene />

        {
          this.props.errors.gps ?
          <GPSError /> : null
        }

        {
          this.props.errors.orientation ?
          <OrientationError /> : null
        }

        {
          this.props.xray.active ?
          <Info /> : null
        }

        {
          this.props.scene.drivers.startup &&
          !this.props.errors.gps ?
          <GPSSpinner /> : null
        }

        {
          this.props.xray.active &&
          !this.props.info.active ?
          <Center /> : null
        }

        {
          this.props.xray.active &&
          !this.props.info.active ?
          <Bearing /> : null
        }

        {
          this.props.xray.active &&
          !this.props.info.active ?
          <Calibration /> : null
        }

        {
          this.props.xray.active &&
          !this.props.xray.hasZoomed &&
          !this.props.info.active ?
          <ZoomTip /> : null
        }

        <div id="debug"></div>

      </div>
    );
  }


}
