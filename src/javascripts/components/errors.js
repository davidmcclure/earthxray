

import { connect } from 'react-redux';
import React, { Component } from 'react';
import GPSError from './gps-error';
import OrientationError from './orientation-error';


@connect(state => (state.errors))
export default class extends Component {


  /**
   * Render the GPS / orientation erors.
   */
  render() {
    return (
      <div className="errors">
        {this.props.gps ? <GPSError /> : null}
        {this.props.orientation ? <OrientationError /> : null}
      </div>
    );
  }


}
