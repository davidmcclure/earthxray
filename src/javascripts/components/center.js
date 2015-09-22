

import React from 'react';
import { connect } from 'react-redux';
import { kmToMi } from '../utils';


@connect(state => ({
  distance: state.xray.distance
}))
export default class extends React.Component {


  /**
   * Render the center.
   */
  render() {

    let distance;

    // If we're below the horizon.
    if (this.props.distance) {

      // KM -> miles.
      let miles = Math.round(kmToMi(this.props.distance));

      distance = (
        <div className="distance">
          <div>{miles.toLocaleString()}</div>{' '}
          <div className="miles">miles</div>
        </div>
      );

    }

    // If we're looking into space.
    else {
      distance = (
        <div className="distance">
          <div className="space">Outer space!</div>
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
