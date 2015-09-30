

import React, { Component, PropTypes } from 'react';

export default class extends Component {


  static contextTypes = {
    events: PropTypes.events.isRequired,
    world:  PropTypes.object.isRequired,
  }


  /**
   * Spin the globe.
   */
  componentDidMount() {

    this.context.events.on('render', () => {
      this.context.world.rotation.y += 0.1;
    });

  }


  render() {
    return null;
  }


}
