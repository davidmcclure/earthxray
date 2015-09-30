

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Scene from './scene';
import GPSError from './gps-error';
import OrientationError from './orientation-error';
import Center from './center';
import Nav from './nav';


@connect(state => ({
  started: state.xray.active,
  errors: state.errors,
}))
export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {
    return (
      <div className="wrapper">

        <Scene />
        <Nav />

        {this.props.errors.gps ?
          <GPSError /> : null}

        {this.props.errors.orientation ?
          <OrientationError /> : null}

        {this.props.started ?
          <Center /> : null}

      </div>
    );
  }


}
