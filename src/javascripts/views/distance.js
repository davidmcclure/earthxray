

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

    let distance = '∞';

    // Convert distance to miles.
    if (this.state.distance != Infinity) {
      distance = Math.round(utils.kmToMi(this.state.distance));
    }

    return <div>{distance}</div>;

  }


}
