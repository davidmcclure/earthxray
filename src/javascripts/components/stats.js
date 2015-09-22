

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Center from './center';


@connect(state => ({
  started: state.xray.active
}))
export default class extends Component {


  /**
   * Render the orientation stats.
   */
  render() {
    return (
      <div className="stats">
        {this.props.started ? <Center /> : null}
      </div>
    );
  }


}
