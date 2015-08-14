

import _ from 'lodash';
import classnames from 'classnames';
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

    let cx = classnames('fa', 'fa-plus', {
      land: this.state.country
    });

    return (
      <i className={cx}></i>
    );

  }


}
