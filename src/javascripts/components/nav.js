

import { connect } from 'react-redux';
import React, { Component } from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import * as actions from '../actions/nav';
import Overlay from './overlay';


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
        <Overlay className="info" animation="zoomIn">

          <h1>Earth Xray</h1>
          <p>See through the world!</p>

          <Tappable onTap={this.props.toggleNav}>
            <button className="btn btn-default btn-lg">Got it</button>
          </Tappable>

        </Overlay>
      );
    }

    let wrapperCx = classNames('nav', {
      active: this.props.active
    });

    let toggleCx = classNames('toggle', 'fa', {
      'fa-bars': !this.props.active,
      'fa-times-circle': this.props.active,
    });

    return (
      <div className={wrapperCx}>

        <Tappable onTap={this.props.toggleNav}>
          <i className={toggleCx}></i>
        </Tappable>

        {info}

      </div>
    );

  }


}
