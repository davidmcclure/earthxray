

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Scene from './scene';
import GPSError from './gps-error';
import OrientationError from './orientation-error';
import Info from './info';
import GPSSpinner from './gps-spinner';
import Center from './center';
import ZoomTip from './zoom-tip';


@connect(state => ({
  xray: state.xray,
  errors: state.errors,
  nav: state.nav,
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
          !this.props.nav.active ?
          <Center /> : null
        }

        {
          this.props.xray.active &&
          !this.props.xray.hasZoomed &&
          !this.props.nav.active ?
          <ZoomTip /> : null
        }

        <div id="debug1"></div>
        <div id="debug2"></div>

      </div>
    );
  }


}
