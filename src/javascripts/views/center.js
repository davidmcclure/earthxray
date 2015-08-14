

import _ from 'lodash';
import React from 'react';


export default class Center extends React.Component {


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
   * Render the center crosshairs.
   */
  render() {
    return (
      <i className="fa fa-plus center"></i>
    );
  }


}
