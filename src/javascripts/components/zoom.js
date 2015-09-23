

import React, { Component } from 'react';


export default class extends Component {


  /**
   * Run the zoom animation.
   */
  componentDidMount() {

    this.addDot();

    this.zoom().then(() => {
      this.removeDot();
    });

  }


  /**
   * Add the location dot.
   */
  addDot() {
    // TODO
  }


  /**
   * Remove the location dot.
   */
  removeDot() {
    // TODO
  }


  /**
   * Zoom into place.
   */
  zoom() {
    // TODO
  }


  render() {
    return null;
  }


}
