

import _ from 'lodash';
import React from 'react';

import * as utils from '../utils';


export default class Distance extends React.Component {


  /**
   * Set default state.
   *
   * @param {Object} props
   */
  constructor(props) {

    super(props);

    this.state = {
      distance: Infinity,
      country: null,
    };

  }


  /**
   * Render the country and distance.
   */
  render() {

    let distance;

    // If we're below the horizon.
    if (this.state.distance != Infinity) {

      // KM -> miles.
      let miles = Math.round(utils.kmToMi(this.state.distance));

      distance = (
        <div className="distance">
          <span>{miles.toLocaleString()}</span>{' '}
          <span className="miles">miles</span>
        </div>
      );

    }

    // If we're looking into space.
    else {
      distance = (
        <div className="distance">∞</div>
      );
    }

    return (
      <div>

        {distance}

        <div className="country">
          {this.state.country}
        </div>

      </div>
    );

  }


}
