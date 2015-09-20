

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

    return (
      <div className="wrapper">

        <Scene />

        // GPS error modal.
        {this.props.gpsError ? <GPSError /> : null}

        // Show center when VR is active.
        {this.props.started ? <Center /> : null}

      </div>
    );

  }


}
