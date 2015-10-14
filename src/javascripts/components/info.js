

import { connect } from 'react-redux';
import React, { Component } from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import * as actions from '../actions/nav';
import Overlay from './overlay';
import Static from './static';

import ribbonHTML from './ribbon.html';
import infoHTML from './info.html';
import linksHTML from './links.html';

import xraySVG from '../../images/xray.svg';


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
        <div>

          <Static html={ribbonHTML} />

          <Overlay animation="zoomIn">

            <Static html={xraySVG} />
            <Static html={infoHTML} />

            <Tappable onTap={this.props.toggleNav}>
              <button className="btn btn-primary btn-lg">Got it</button>
            </Tappable>

            <Static html={linksHTML} className="social" />

          </Overlay>

        </div>
      );
    }

    let wrapperCx = classNames('info', {
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
