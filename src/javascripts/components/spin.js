

import React, { Component, PropTypes } from 'react';

export default class extends Component {


  static contextTypes = {
    world:  PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
  }


  /**
   * Spin the globe.
   */
  componentDidMount() {

    this.context.events.on('render', () => {
      this.context.world.rotation.y += 0.01;
    });

  }


  render() {
    return null;
  }


}
