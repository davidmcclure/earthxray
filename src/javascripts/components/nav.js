

import { connect } from 'react-redux';
import React, { Component } from 'react';
import classNames from 'classnames';
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

    let info = null;

    if (this.props.active) {
      info = (
        <Overlay className="info">
          <h1>Earth Xray</h1>
          <p>See through the world!</p>
        </Overlay>
      );
    }

    let cx = classNames('nav', {
      active: this.props.active
    });

    return (
      <div className={cx}>

        <Tappable onTap={this.toggle.bind(this)}>
          <i className="toggle fa fa-bars"></i>
        </Tappable>

        {info}

      </div>
    );

  }


  /**
   * Toggle the info.
   */
  toggle() {
    this.props.toggleNav();
  }


}
