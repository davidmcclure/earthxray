

import React, { Component, findDOMElement } from 'react';


export default class extends Component {


  /**
   * Set the pulse interval.
   */
  componentDidMount() {
    this.interval = setInterval(this.pulse, 300);
  }


  /**
   * Clear the pulse interval.
   */
  componentWillUnmount() {
    clearInterval(this.interval);
  }


  /**
   * Pulse the tip.
   */
  pulse() {
    console.log('pulse');
  }


  /**
   * Render the zoom tip.
   */
  render() {
    return (
      <div className="zoom-tip">
        <span>Pinch to zoom</span>
      </div>
    );
  }


}
