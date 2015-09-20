

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
    return (
      <div className="wrapper">

        <Scene />

        // Show center when VR is active.
        {this.props.started ? <Center /> : null}

      </div>
    );
  }


}
