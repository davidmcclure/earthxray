

import React, { Component } from 'react';
import Static from './static';
import xraySVG from '../images/xray.svg';


export default class extends Component {


  /**
   * Render the logo.
   */
  render() {
    return <Static className="logo" html={xraySVG} />
  }


}
