

import React from 'react';
import {kmToMi} from '../utils';


export default class Center extends React.Component {


  /**
   * Set default state.
   *
   * @param {Object} props
   */
  constructor(props) {

    super(props);

    this.state = {
      distance: null
    };

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
      <div>
        <div className="stats">
          {distance}
        </div>
      </div>
    );

  }


}
