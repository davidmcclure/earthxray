

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Scene from './scene';
import Center from './center';


@connect(state => ({
  started: state.xray.active
}))
export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {

    // Show center stats when VR is active.
    let center = this.props.started ?  <Center /> : null;

    return (
      <div className="wrapper">
        <Scene />
        {center}
      </div>
    );

  }


}
