

import React, { Component } from 'react';
import Err from './err';


export default class extends Component {


  /**
   * Render the GPS error modal.
   */
  render() {
    return <Err msg="Whoops, can't get a GPS location" />;
  }


}
