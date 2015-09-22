

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Scene from './scene';
import Errors from './errors';
import Center from './center';


@connect(state => ({
  started: state.xray.active,
}))
export default class extends Component {


  /**
   * Render the top-level application structure.
   */
  render() {

    let center = this.props.started ?
      <Center /> : null;

    return (
      <div className="wrapper">
        <Scene />
        <Errors />
        {center}
      </div>
    );

  }


}
