

import React, { Component } from 'react';
import Err from './err';


export default class extends Component {


  /**
   * Render the orientation error modal.
   */
  render() {
    return <Err msg="Whoops, no accelerometer" />;
  }


}
