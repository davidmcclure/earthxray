

import React from 'react';
import classNames from 'classnames';
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
        <div className="distance">Outer space!</div>
      );
    }

    return (
      <div>

        <i className="crosshair fa fa-bullseye"></i>

        <div className="stats">
          {distance}
        </div>

      </div>
    );

  }


}
