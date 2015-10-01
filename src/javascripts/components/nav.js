

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tappable from 'react-tappable';
import Overlay from './overlay';
import * as actions from '../actions/nav';


@connect(
  state => state.nav,
  actions
)
export default class extends Component {


  /**
   * Render navigation.
   */
  render() {
    return (
      <div className="nav">

        <Tappable onTap={this.toggle}>
          <i className="toggle fa fa-bars"></i>
        </Tappable>

        <Overlay className="info">
          <h1>Earth Xray</h1>
        </Overlay>

      </div>
    );
  }


  /**
   * Toggle the info.
   */
  toggle() {
    console.log('toggle');
  }


}
